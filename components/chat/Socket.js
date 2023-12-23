import React, { useState, useEffect, useContext, createContext, useRef } from 'react'
import axios from 'axios';
import Realm from "realm";
import { io } from "socket.io-client";
import { endpoints } from '../../endpoints'
import { useDispatch } from 'react-redux';
import { callVoip } from '../redux/slize';

let storage = endpoints.storage
let connection = endpoints.connection

let AgentContext = createContext()

export function useSocket(){
    return useContext(AgentContext)
}

export function SocketHook({ children }){
    let socket = useRef()    
    let dispatch = useDispatch()
    let [activeUsers, setActiveUsers] = useState([])
    let [messages, setMessage] = useState([])
    let [offer, setOffer] = useState(undefined)
    let [answer, setAnswer] = useState(undefined)

    /* To handle incoming and outgoing message */
    function socketConnection(){
        if(!socket.current){
            socket.current = io(connection)

            // To update as online
            socket.current.on('client-id', async(id) => {
                try{
                    const tokeSchema = await Realm.open({
                        schema: [
                          {
                            name: 'Token',
                            properties: {
                              username: 'string',
                              email: 'string',  
                              token: 'string',
                            },
                          },
                        ],
                    })
        
                    const token = tokeSchema.objects('Token')
                    console.log('Pushed to make available')
                    socket.current.emit('update-online', {email: token[0].email, sockid: id})
                }
                catch(err){
                    console.log('Line 83 : ' + err);
                }
            })

            // Receive message from peer
            socket.current.on('received-msg', (payload) => {
                let msgFormat = {
                    type: 'get', 
                    time: currentTime(), 
                    name: payload.username,  
                    message: payload.message
                }

                setMessage(prev => [msgFormat, ...prev])
            })

            // Receive call from peer
            socket.current.on('receiving-call', (payload) => {
                setOffer(payload.peer)
                dispatch(callVoip('Answers'))
            })

            // Accept call
            socket.current.on('call-accepted', (payload) => {
                setAnswer(payload.peer)
            })

            // Triggers when new user join
            socket.current.on('user-base', (payload) => {
                onlineActiveUsers()
            })
        }
    }

    /* To check online active users */
    function onlineActiveUsers(){
        axios.get(`${connection}/activeusers`)
        .then(async(res) => {
            try{
                const tokeSchema = await Realm.open({
                    schema: [
                      {
                        name: 'Token',
                        properties: {
                          username: 'string',
                          email: 'string',  
                          token: 'string',
                        },
                      },
                    ],
                })
    
                const token = tokeSchema.objects('Token')

                let temp = []
                res.data.map((user) => {
                    if(user.email != token[0].email){
                        temp.push(user)
                    }
                })
                setActiveUsers(temp)
            }
            catch(err){
                console.log('Line 83 : ' + err);
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    /* To emit message via socket */
    function emitMessage(type, payload){
        switch(type){
            case 'update-offline':
                socket.current.emit('update-offline', payload)
                socket.current = null
                break
            case 'send-msg':
                socket.current.emit('send-msg', payload)
            case 'make-call':
                socket.current.emit('make-call', payload)
            case 'accept-call':
                socket.current.emit('accept-call', payload)
            default:
                console.log('Default triggered');
        }
    }

    /* To get the current time in 12hrs format */
    function currentTime(){
        const d = new Date()
        const time = d.getHours()

        if(time > 12){
            let temp = time - 12
            if(d.getMinutes().toString().length === 1){
                let current_time = temp.toString()+':'+'0'+d.getMinutes().toString()+' PM'
                return current_time
            }
            else {
                let current_time = temp.toString()+':'+d.getMinutes().toString()+' PM'
                return current_time
            }
        }
        else if(d.getHours() == 0){
            if(d.getMinutes().toString().length == 1){
                let current_time = '12:'+'0'+d.getMinutes().toString()+' AM'
                return current_time
            }
            else {
                let current_time = '12'+':'+d.getMinutes().toString()+' AM'
                return current_time
            }
        }
        else if(d.getHours() == 12){
            if(d.getMinutes().toString().length == 1){
                let current_time = '12:'+'0'+d.getMinutes().toString()+' PM'
                return current_time
            }
            else {
                let current_time = '12'+':'+d.getMinutes().toString()+' PM'
                return current_time
            }
        }
        else{
            if(d.getMinutes().toString().length == 1){
                let current_time = d.getHours().toString()+':'+'0'+d.getMinutes().toString()+' AM'
                return current_time
            }
            else{
                let current_time = d.getHours().toString()+':'+d.getMinutes().toString()+' AM'
                return current_time
            }
        }
    }

    return(
        <AgentContext.Provider value={{
            messages, setMessage,
            socketConnection, emitMessage,
            onlineActiveUsers, activeUsers,
            offer, setOffer,
            answer, setAnswer
        }}>
            { children }
        </AgentContext.Provider>
    )
}
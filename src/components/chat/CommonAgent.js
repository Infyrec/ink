import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { io } from "socket.io-client";
import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { inkdb } from '../inkdb';

let endpoint = process.env.REACT_APP_AUTHENTICATION // Authentication server
let connection = process.env.REACT_APP_CONNECTION // Socket server

let CommonContext = createContext()

export function useCommonAgent(){
    return useContext(CommonContext)
}

export function CommonAgent({ children }){
    let socket = useRef()
    let navigate = useNavigate()
    
    let [focused, setFocused] = useState(null)
    let [activeUsers, setActiveUsers] = useState([])
    let [message, setMessage] = useState([]) //{type: 'post', time: null, name: 'Ragul', message: 'Hello'}
    let [visible, setVisible] = useState(false)

    // To check the authorization & initialization
    useEffect(() => {
        // To verify login and update as online
        loginAndUpdates()

        // To fetch the active users list
        onlineActiveUsers()
    }, [])

    // To update as online ----->
    function loginAndUpdates(){
        axios.get(`${endpoint}/chat`, {withCredentials: true})
        .then((res) => {
            let status = res.data.verified
            if(!status){
                navigate('/login')
            }

            if(!socket.current){
                socket.current = io(connection)

                // To update as online
                socket.current.on('client-id', (id) => {
                    console.log('Socket ID: ' + id);
                    let { username, email } = JSON.parse(localStorage.getItem('ink-user'))
                    console.log(username, email);
                    socket.current.emit('update-online', {email: email, sockid: id})
                })
    
                // Receive message from peer
                socket.current.on('received-msg', (payload) => {

                    let msgFormat = {
                        type: 'get', 
                        time: currentTime(), 
                        name: payload.username,  
                        message: {
                            type: 'text',
                            message: payload.message
                        }
                    }

                    inkdb.add(payload.username, msgFormat)
                    setMessage(prev => [...prev, msgFormat])
                })

                // Receive media buffer from peer
                socket.current.on('received-buffer', (data) => {
                    console.log(data.layer, data.buffer);
                })

                // Triggers when new user join
                socket.current.on('user-base', (payload) => {
                    onlineActiveUsers()
                })
            }
        })
        .catch((err) => {
            navigate('/login')
        })
    }


    // To get active users
    function onlineActiveUsers(){
        axios.get(`${connection}/activeusers`)
        .then((res) => {
            let { username, email } = JSON.parse(localStorage.getItem('ink-user'))
            let temp = []
            res.data.map((user) => {
                if(user.email != email){
                    temp.push(user)
                }
            })
            setActiveUsers(temp)
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // To get the current time in 12hrs format
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

    // To emit message via socket
    function emitMessage(type, payload){
        switch(type){
            case 'update-offline':
                socket.current.emit('update-offline', payload)
                socket.current = null
                navigate('/login')
                break
            case 'send-msg':
                socket.current.emit('send-msg', payload)
            default:
                console.log('Default triggered');
        }
    }

    return(
        <CommonContext.Provider value={{ 
            focused, setFocused,
            message, setMessage,
            activeUsers, setActiveUsers,
            onlineActiveUsers, currentTime,
            visible, setVisible,
            emitMessage
         }}>
            {children}
        </CommonContext.Provider>
    )
}
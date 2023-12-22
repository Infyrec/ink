import React, { useState, useEffect, useContext, createContext, useRef } from 'react'
import axios from 'axios';
import Realm from "realm";
import { io } from "socket.io-client";
import { endpoints } from '../endpoints'

let storage = endpoints.storage
let connection = endpoints.connection

let AgentContext = createContext()

export function useCommonAgent(){
    return useContext(AgentContext)
}

export function CommonAgent({ children }){

    let socket = useRef()
    let [authorized, setAuthorization] = useState(false)
    let [percentage, setPercentage] = useState(0)
    let [diskspace, setDiskSpace] = useState({
        free: 0,
        size: 0
    })
    let [fileList, setFileList] = useState([])
    let [activeUsers, setActiveUsers] = useState([])
    let [messages, setMessage] = useState([])

    useEffect(() => {
        /* To get/fetch disk space */
        readSize()
        /* To read files */
        readFiles()
    }, [])

    /* To read the size of the disk */
    function readSize(){
        axios.get(`${storage}/diskspace`)
        .then((res) => {
            setDiskSpace({
                free: Math.round(res.data.free),
                size: Math.round(res.data.size)
            })
            setPercentage((Math.round(res.data.size)-Math.round(res.data.free))/Math.round(res.data.size)*100)
        })
        .catch((e) => {
            console.log('Error : ' + e);
        })
    }

    /* To read the list of files */
    function readFiles(){
        axios.get(`${storage}/readfiles`)
        .then((res) => {
            setFileList(res.data.files)
        })
        .catch((e) => {
            console.log('Error: ' + e);
        })
    }

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
            authorized, setAuthorization,
            percentage, setPercentage,
            diskspace, setDiskSpace,
            fileList, setFileList,
            readFiles, readSize,
            messages, setMessage,
            socketConnection, emitMessage,
            onlineActiveUsers, activeUsers
        }}>
            { children }
        </AgentContext.Provider>
    )
}
import './styles/chat.css';

import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { io } from "socket.io-client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useGlobalVariable } from './GlobalVariable';
import { inkdb } from './inkdb';

let endpoint = process.env.REACT_APP_AUTHENTICATION // Authentication server
let connection = process.env.REACT_APP_CONNECTION // Socket server

export default function Chat(){

    let socket = useRef()
    let scrollRef = useRef()
    let navigate = useNavigate()
    let { email, updateEmail } = useGlobalVariable()

    let [leftModal, setLeftModal] = useState(false)
    let [error, setError] = useState({
        status: false,
        message: 'This feature not enabled !'
    })
    let [activeUsers, setActiveUsers] = useState([])
    let [focused, setFocused] = useState(null)
    let [written, setWritten] = useState(null)
    let [message, setMessage] = useState([]) //{type: 'post', time: null, name: 'Ragul', message: 'Hello'}

    // To check the authorization & initialization
    useEffect(() => {
        // To verify login and update as online
        loginAndUpdates()

        // To fetch the active users list
        onlineActiveUsers()
    }, [])

    // To auto scroll
    useEffect(() => {
        if(message.length > 0 && focused != null){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [message])

    // To update as online ----->
    function loginAndUpdates(){
        axios.get(`${endpoint}/chat`, {withCredentials: true})
        .then((res) => {
            let status = res.data.verified
            if(!status){
                navigate('/')
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
                        message: payload.message
                    }

                    inkdb.add(payload.username, msgFormat)
                    setMessage(prev => [...prev, msgFormat])
                })

                // Triggers when new user join
                socket.current.on('user-base', (payload) => {
                    onlineActiveUsers()
                })
            }
        })
        .catch((err) => {
            navigate('/')
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

    // Sender's UI component
    function SentMessage(props){
        let { name, time, message } = props
        return(
            <div className="is-flex is-justify-content-flex-end" id="right-msg-box">
                <div className="outerlayer my-3">
                    <div className="is-flex is-flex-direction-row-reverse is-align-items-center">
                        <img className="profile mx-2" src={require('./assets/avatar.png')}/> 
                        <p className="mx-2 custom-font is-size-7 has-text-weight-semibold">{name}</p>
                        <p className="mx-2 custom-font is-size-7 has-text-grey-light">{time}</p>
                    </div>
                    <div className="is-flex is-justify-content-flex-end mr-6">
                        <span className="layer-2-right p-2 has-text-white custom-font is-size-7">{message}</span>
                    </div>
                </div>
            </div>
        )
    }

    // Receiver's UI component
    function ReceivedMessage(props){
        let { name, time, message } = props
        return(
            <div className="is-flex is-justify-content-flex-start" id="right-msg-box">
                <div className="outerlayer my-3">
                    <div className="is-flex is-flex-direction-row is-align-items-center">
                        <img className="profile mx-2" src={require('./assets/avatar.png')}/> 
                        <p className="mx-2 custom-font is-size-7 has-text-weight-semibold">{name}</p>
                        <p className="mx-2 custom-font is-size-7 has-text-grey-light">{time}</p>
                    </div>
                    <div className="is-flex is-justify-content-flex-start ml-6">
                        <span className="layer-2-left p-2 has-text-white custom-font is-size-7">{message}</span>
                    </div>
                </div>
            </div>
        )
    }

    // To logout user
    function logoutUser(){
        axios.get(`${endpoint}/logout`, {withCredentials: true})
        .then((res) => {
            let { username, email } = JSON.parse(localStorage.getItem('ink-user'))
            socket.current.emit('update-offline', {email: email})
            socket.current = null
            navigate('/')              
        })
        .catch((err) => {
            console.log('Logout Error: ' + err);
        });
    }

    // To show features not enabled
    function notEnabled(){
        setError({
            status: true,
            message: 'This feature not enabled !'
        })

        setTimeout(() => {
            setError({
                status: false,
                message: 'This feature not enabled !'
            })
        }, 2000)
    }

    // To send message
    function sendMessage(){
        if(written != null && written.length > 0){
            let { username, email } = JSON.parse(localStorage.getItem('ink-user'))
            let payload = {
                message: written,
                sendTo: focused.email,
                username: username
            }

            let msgFormat = {
                type: 'post', 
                time: currentTime(), 
                name: username, 
                message: written
            }

            inkdb.add(focused.username, msgFormat)

            setMessage(prev => [...prev, msgFormat])

            socket.current.emit('send-msg', payload)
            setWritten('')
        }
    }

    // To fetch the message from DB
    async function fetchMessage(user){
        setFocused(user)
        let result = await inkdb.get(user.username)
        setMessage(result)
    }

    return(
    <section className="hero is-fullheight">
        <div className="columns m-0">
            {/* Left column */}
            <div className="column is-one-quarter has-background-white is-flex is-flex-direction-column full-height borders is-hidden-mobile is-hidden-tablet-only">
                {/* Left side header */}
                <div>
                    <p className="custom-font subtitle has-text-weight-bold has-text-centered left-title">INFYREC</p>
                    <div className="is-flex is-justify-content-center">
                        <p className="control has-icons-left">
                            <input className="input" type="text" placeholder="Search" onFocus={notEnabled}/>
                            <span className="icon is-small is-left">
                                <i className="fas fa-solid fa-magnifying-glass"></i>
                            </span>
                        </p>
                        <button className="button mx-1" style={{ backgroundColor: " #296eff" }}>
                            <span className="icon">
                                <i class="fa-solid fa-address-book has-text-white"></i>
                            </span>
                        </button>
                    </div>
                </div>
                {/* Left tabs */}
                <div className="is-flex is-justify-content-center my-5">
                    <div className="tabs is-toggle">
                        <ul>
                            <li className="is-active">
                                <a onClick={notEnabled}>
                                <span className="icon is-small"><i className="fa-solid fa-comment"></i></span>
                                <span className="custom-font">Chats</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={notEnabled}>
                                <span className="icon is-small"><i className="fa-solid fa-phone"></i></span>
                                <span className="custom-font">Calls</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={notEnabled}>
                                <span className="icon is-small"><i className="fa-solid fa-file"></i></span>
                                <span className="custom-font">Files</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Left side list */}
                <div className="is-flex-grow-1 contact-list" style={{overflowY: "auto"}}>
                    {
                        activeUsers.map((active) => (
                            <a className="panel-block custom-font" onClick={() => fetchMessage(active)}>
                                <img className="profile" src={require('./assets/avatar.png')}/>                                            
                                <div className="is-flex is-flex-direction-column ml-2">
                                    <span className="has-text-weight-bold custom-font">{active.username}</span>
                                    <span className="is-size-7 has-text-primary">{active.email}</span>
                                </div>
                            </a>
                        ))
                    }
                </div>
                <span className="has-text-centered is-size-7 custom-font has-text-grey-light">Copyright © 2023 Infyrec</span>
            </div>
            {/* Right column */}
            {
                focused ?
                <div className="column has-background-white is-flex is-flex-direction-column borders full-height">
                    {/* Right side header */}
                    <div className="is-flex is-justify-content-space-between border-bottom">
                        <div className="is-flex">
                            <button className="button mr-3 is-hidden-desktop" onClick={() => setLeftModal(true)}>
                                <span className="icon">
                                    <i className="fas fa-bars"></i>
                                </span>
                            </button>
                            <img className="profile" src={require('./assets/avatar.png')}/>                                            
                            <div className="is-flex is-flex-direction-column ml-2">
                                <span className="has-text-weight-bold custom-font">{focused.username}</span>
                                <span className="is-size-7 has-text-primary">Online</span>
                            </div>
                        </div>
                        <div className="is-flex">
                            <button className="button mx-1" onClick={notEnabled}>
                                <span className="icon">
                                    <i className="fas fa-video"></i>
                                </span>
                            </button>
                            <button className="button mx-1" onClick={notEnabled}>
                                <span className="icon">
                                    <i className="fa-solid fa-phone"></i>
                                </span>
                            </button>
                            <button className="button mx-1 has-background-danger" onClick={logoutUser}>
                                <span className="icon">
                                    {/* <i className="fa-solid fa-bars"></i> */}
                                    <i class="fa-solid fa-right-from-bracket has-text-white"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    {/* Chat message area */}
                    <div className="is-flex-grow-1 chat-area my-3" ref={scrollRef}>
                        {
                            message.map((data) => (
                                data.type == 'post'?
                                <SentMessage name={data.name} time={data.time} message={data.message}/>:
                                data.type == 'get'?
                                <ReceivedMessage name={data.name} time={data.time} message={data.message}/>:
                                null
                            ))
                        }
                    </div>
                    {/* Input field */}
                    <div className="is-flex is-flex-direction-row">
                        <div className="field mx-1" style={{width: "100%"}}>
                            <p className="control">
                                <input className="input" type="text" placeholder="Type a message..." value={written} onChange={(e) => setWritten(e.target.value)}/>
                            </p>
                        </div>
                        <div className="button mx-1">
                            <span className="icon is-small mx-1" onClick={notEnabled}>
                                <i className="fa-solid fa-image"></i>
                            </span>
                            <span className="icon is-small mx-1" onClick={notEnabled}>
                                <i className="fa-solid fa-location-dot"></i>
                            </span>
                            <span className="icon is-small mx-1" onClick={notEnabled}>
                                <i className="fa-solid fa-microphone"></i>
                            </span>
                        </div>
                        <button className="button" style={{ backgroundColor: " #296eff" }} onClick={sendMessage}>
                            <span className="icon is-small">
                                <i className="fa-regular fa-paper-plane has-text-white"></i>
                            </span>
                        </button>
                    </div>
                </div>:
                <div className="column has-background-white is-flex is-flex-direction-column borders full-height">
                    {/* Right side header */}
                    <div className="is-flex is-justify-content-space-between border-bottom">
                        <div className="is-flex">
                            <button className="button mr-3 is-hidden-desktop" onClick={() => setLeftModal(true)}>
                                <span className="icon">
                                    <i className="fas fa-bars"></i>
                                </span>
                            </button>                                      
                            <div className="is-flex is-flex-direction-column ml-2">
                                <span className="has-text-weight-bold custom-font">Welcome To Ink</span>
                            </div>
                        </div>
                        <div className="is-flex">
                            <button className="button mx-1 has-background-danger" onClick={logoutUser}>
                                <span className="icon">
                                    {/* <i className="fa-solid fa-bars"></i> */}
                                    <i class="fa-solid fa-right-from-bracket has-text-white"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
        {/* Leftside menu as modal */}
        <div className={`modal ${leftModal ? 'is-active':'is-hidden'}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <section className="modal-card-body mx-4">
                    {/* Left side header */}
                    <div>
                        <p className="custom-font subtitle has-text-weight-bold has-text-centered left-title">INFYREC</p>
                        <div className="is-flex is-justify-content-center">
                            <p className="control has-icons-left">
                                <input className="input" type="text" placeholder="Search" onFocus={notEnabled}/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-solid fa-magnifying-glass"></i>
                                </span>
                            </p>
                            <button className="button mx-1" style={{ backgroundColor: " #296eff" }}>
                                <span className="icon">
                                    <i class="fa-solid fa-address-book has-text-white"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    {/* Left tabs */}
                    <div className="is-flex is-justify-content-center my-5">
                        <div className="tabs is-toggle">
                            <ul>
                                <li className="is-active">
                                    <a onClick={notEnabled}>
                                    <span className="icon is-small"><i className="fa-solid fa-comment"></i></span>
                                    <span className="custom-font">Chats</span>
                                    </a>
                                </li>
                                <li>
                                    <a onClick={notEnabled}>
                                    <span className="icon is-small"><i className="fa-solid fa-phone"></i></span>
                                    <span className="custom-font">Calls</span>
                                    </a>
                                </li>
                                <li>
                                    <a onClick={notEnabled}>
                                    <span className="icon is-small"><i className="fa-solid fa-file"></i></span>
                                    <span className="custom-font">Files</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Left side list */}
                    <div className="is-flex-grow-1 contact-list" style={{overflowY: "auto"}}>
                        {
                            activeUsers.map((active) => (
                                <a className="panel-block custom-font" onClick={() => {
                                    fetchMessage(active)
                                    setLeftModal(false)
                                }}>
                                    <img className="profile" src={require('./assets/avatar.png')}/>                                            
                                    <div className="is-flex is-flex-direction-column ml-2">
                                        <span className="has-text-weight-bold custom-font">{active.username}</span>
                                        <span className="is-size-7 has-text-primary">{active.email}</span>
                                    </div>
                                </a>
                            ))
                        }
                    </div>
                    <div className="is-flex is-flex-direction-column is-align-items-center">
                        <button class="button is-danger my-2" onClick={() => setLeftModal(false)}>Close</button>
                        <span className="is-size-7 custom-font has-text-grey-light my-2">Copyright © 2023 Infyrec</span>
                    </div>
                </section>
            </div>
        </div>

        { /* To show notifcations */}
        {
            error.status ?
            <div className="error-box is-flex is-align-items-center p-4" data-aos="fade-left">
                <p className="has-text-danger custom-font is-size-7">{error.message}</p>
            </div>:
            null
        }
    </section>
    )
}
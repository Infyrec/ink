import AOS from 'aos';
import axios from 'axios';
import React, { useState, useEffect, useRef, useContext } from "react";
import { inkdb } from '../inkdb';
import { useCommonAgent } from './CommonAgent';

let endpoint = process.env.REACT_APP_AUTHENTICATION // Authentication server
let connection = process.env.REACT_APP_CONNECTION // Socket server

export default function Main(){
    let { 
        focused, setFocused, 
        message, setMessage, 
        onlineActiveUsers, activeUsers, 
        setActiveUsers, currentTime,
        visible, setVisible,
        emitMessage
    } = useCommonAgent()
    let scrollRef = useRef()
    let [error, setError] = useState({
        status: false,
        message: 'This feature not enabled !'
    })
    let [written, setWritten] = useState(null)

    useEffect(() => {
        AOS.init();
    }, [])

    // To auto scroll
    useEffect(() => {
        if(message.length > 0 && focused != null){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [message])

    // Sender's UI component
    function SentMessage(props){
        let { name, time, message } = props
        return(
            <div className="is-flex is-justify-content-flex-end" id="right-msg-box">
                <div className="outerlayer my-3">
                    <div className="is-flex is-flex-direction-row-reverse is-align-items-center">
                        <img className="profile mx-2" src={require('../assets/avatar.png')}/> 
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
                        <img className="profile mx-2" src={require('../assets/avatar.png')}/> 
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
            emitMessage('update-offline', {email: email})        
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
                message: {
                    type: 'text',
                    message: written
                }
            }

            inkdb.add(focused.username, msgFormat)

            setMessage(prev => [...prev, msgFormat])

            emitMessage('send-msg', payload)

            setWritten('')
        }
    }

    if(focused){
        return(
            <div className={`column has-background-white is-flex is-flex-direction-column borders full-height ${visible ? 'is-hidden':null}`}>
                {/* Right side header */}
                <div className="is-flex is-justify-content-space-between border-bottom">
                    <div className="is-flex">
                        <button className="button mr-3 is-hidden-desktop" onClick={() => setVisible(!visible)}>
                            <span className="icon">
                                <i className="fas fa-bars"></i>
                            </span>
                        </button>
                        <img className="profile" src={require('../assets/avatar.png')}/>                                            
                        <div className="is-flex is-flex-direction-column ml-2">
                            <span className="has-text-weight-bold custom-font">{focused.username}</span>
                            <span className="is-size-7 has-text-primary">Online</span>
                        </div>
                    </div>
                    <div className="is-flex">
                        <button className="button mx-1" onClick={notEnabled}>
                            <span className="icon">
                                <i className="fas fa-display"></i>
                            </span>
                        </button>
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
                            <SentMessage name={data.name} time={data.time} message={data.message.message}/>:
                            data.type == 'get'?
                            <ReceivedMessage name={data.name} time={data.time} message={data.message.message}/>:
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
                            <i className="fa-solid fa-paperclip"></i>
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
                { /* To show notifcations */}
                {
                    error.status ?
                    <div className="error-box is-flex is-align-items-center p-4" data-aos="fade-left">
                        <p className="has-text-danger custom-font is-size-7">{error.message}</p>
                    </div>:
                    null
                }
            </div>
        )
    }
    else{
        return(
            <div className={`column has-background-white is-flex is-flex-direction-column borders full-height ${visible ? 'is-hidden':null}`}>
                {/* Right side header */}
                <div className="is-flex is-justify-content-space-between border-bottom">
                    <div className="is-flex">
                        <button className="button mr-3 is-hidden-desktop" onClick={() => setVisible(!visible)}>
                            <span className="icon">
                                <i className="fas fa-bars"></i>
                            </span>
                        </button>                                      
                        <div className="is-flex is-flex-direction-column is-justify-content-center ml-2">
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
                { /* To show notifcations */}
                {
                    error.status ?
                    <div className="error-box is-flex is-align-items-center p-4" data-aos="fade-left">
                        <p className="has-text-danger custom-font is-size-7">{error.message}</p>
                    </div>:
                    null
                }
            </div>
        )
    }
}
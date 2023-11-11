import './styles/chat.css';

import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef, useContext } from "react";

let endpoint = 'http://192.168.0.213:3001'

export default function Chat(){

    let navigate = useNavigate()

    let [error, setError] = useState({
        status: false,
        message: 'This feature not enabled !'
    })

    let [message, setMessage] = useState([
        {type: 'post', time: null, name: 'Ragul', message: 'Hello'},
        {type: 'get', time: null, name: 'Suriya', message: 'Hi'}
    ])

    useEffect(() => {
        axios.get(`${endpoint}/chat`, {withCredentials: true})
        .then((res) => {
            let status = res.data.verified
            if(!status){
                navigate('/')
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

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

    function logoutUser(){

    }

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
                    <a className="panel-block custom-font">
                        <img className="profile" src={require('./assets/avatar.png')}/>                                            
                        <div className="is-flex is-flex-direction-column ml-2">
                            <span className="has-text-weight-bold custom-font">Infyrec Community</span>
                            <span className="is-size-7 has-text-primary">enquire@infyrec.in</span>
                        </div>
                    </a>
                </div>
                <span className="has-text-centered is-size-7 custom-font has-text-grey-light">Copyright © 2023 Infyrec</span>
            </div>
            {/* Right column */}
            <div className="column has-background-white is-flex is-flex-direction-column borders full-height">
                {/* Right side header */}
                <div className="is-flex is-justify-content-space-between border-bottom">
                    <div className="is-flex">
                        <img className="profile" src={require('./assets/avatar.png')}/>                                            
                        <div className="is-flex is-flex-direction-column ml-2">
                            <span className="has-text-weight-bold custom-font">Infyrec Community</span>
                            <span className="is-size-7 has-text-grey-light">Offline</span>
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
                        <button className="button mx-1 has-background-warning" onClick={logoutUser}>
                            <span className="icon">
                                {/* <i className="fa-solid fa-bars"></i> */}
                                <i class="fa-solid fa-right-from-bracket"></i>
                            </span>
                        </button>
                    </div>
                </div>
                {/* Chat message area */}
                <div className="is-flex-grow-1 chat-area my-3">
                    {
                        message.map((data) => (
                            data.type == 'post'?
                            <SentMessage name={data.name} time={currentTime()} message={data.message}/>:
                            data.type == 'get'?
                            <ReceivedMessage name={data.name} time={currentTime()} message={data.message}/>:
                            null
                        ))
                    }
                </div>
                {/* Input field */}
                <div className="is-flex is-flex-direction-row">
                    <div className="field mx-1" style={{width: "100%"}}>
                        <p className="control">
                            <input className="input" type="text" placeholder="Type a message..." />
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
                    <button className="button" style={{ backgroundColor: " #296eff" }}>
                        <span className="icon is-small">
                            <i className="fa-regular fa-paper-plane has-text-white"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>

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
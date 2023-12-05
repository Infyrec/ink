import axios from 'axios';
import React, { useState, useEffect, useRef, useContext } from "react";
import { inkdb } from '../inkdb';
import { useCommonAgent } from './CommonAgent';

let endpoint = process.env.REACT_APP_AUTHENTICATION // Authentication server
let connection = process.env.REACT_APP_CONNECTION // Socket server

export default function Leftside(){

    let { 
        focused, setFocused, 
        message, setMessage, 
        onlineActiveUsers, activeUsers, 
        setActiveUsers, currentTime,
        visible, setVisible 
    } = useCommonAgent()

    let [error, setError] = useState({
        status: false,
        message: 'This feature not enabled !'
    })

    // To check the authorization & initialization
    useEffect(() => {
        // To fetch the active users list
        onlineActiveUsers()
    }, [])

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

    // To fetch the message from DB
    async function fetchMessage(user){
        setFocused(user)
        let result = await inkdb.get(user.username)
        setMessage(result)
        //setVisible(!visible)
    }

    return(
        <div className={`column has-background-white is-flex is-flex-direction-column full-height borders ${visible ? 'is-visible':'is-hidden-touch is-one-quarter'}`}>
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
                    <button className="button mx-1" style={{ backgroundColor: " #296eff" }} onClick={() => setVisible(!visible)}>
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
                            <img className="profile" src={require('../assets/avatar.png')}/>                                            
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
    )
}
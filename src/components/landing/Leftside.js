import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useUploadAgent } from './UploadAgent';

let endpoint = process.env.REACT_APP_AUTHENTICATION // Authentication server
let connection = process.env.REACT_APP_CONNECTION // Socket server

export default function Leftside(){
    let navigate = useNavigate()
    let { uploadProgress, uploadFile, emitMessage } = useUploadAgent()

    // To logout user
    function logoutUser(){
        axios.get(`${endpoint}/logout`, {withCredentials: true})
        .then((res) => {
            navigate('/login')    
        })
        .catch((err) => {
            console.log('Logout Error: ' + err);
        });
    }

    return(
        <div className="column is-one-fifth full-height custom-border is-flex is-flex-direction-column is-hidden-touch">
            <div className="is-flex is-justify-content-center my-4">
                <figure className="image is-128x128">
                    <img className="is-rounded" src={require('../assets/Ragul.jpg')}/>
                </figure>
            </div>
            <div className="is-flex-grow-1 my-4">
                <aside className="menu">
                    <ul className="menu-list">
                        <li>
                            <a className="custom-font is-active">
                                <span className="icon">
                                    <i className="fas fa-cloud"></i>
                                </span>
                                My Cloud
                            </a>
                        </li>
                        <li>
                            <a className="custom-font">
                                <span className="icon">
                                    <i className="fas fa-share-from-square"></i>
                                </span>
                                Shared
                            </a>
                        </li>
                        <li>
                            <label>
                                <a className="custom-font">
                                    <span className="icon">
                                        <i className="fas fa-upload"></i>
                                        <input type='file' style={{display: "none"}} onChange={uploadFile}/>
                                    </span>
                                    Upload
                                </a>
                            </label>
                        </li>
                        <li>
                            <a className="custom-font" onClick={() => navigate('/chat')}>
                                <span className="icon">
                                    <i className="fas fa-message"></i>
                                </span>
                                Chat
                            </a>
                        </li>
                    </ul>
                </aside>
            </div>
            <div>
                <aside className="menu">
                    <ul className="menu-list">
                        <li>
                            <a className="custom-font">
                                <span className="icon">
                                    <i className="fas fa-gear"></i>
                                </span>
                                Settings
                            </a>
                        </li>
                        <li>
                            <a className="custom-font" onClick={logoutUser}>
                                <span className="icon">
                                    <i className="fas fa-right-from-bracket"></i>
                                </span>
                                Logout
                            </a>
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    )
}
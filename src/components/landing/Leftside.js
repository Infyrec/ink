import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useUploadAgent } from './UploadAgent';

let endpoint = process.env.REACT_APP_AUTHENTICATION // Authentication server
let connection = process.env.REACT_APP_CONNECTION // Socket server
let storage = process.env.REACT_APP_STORAGE

export default function Leftside(){
    let navigate = useNavigate()
    let { uploadProgress, uploadFile, trigger, menu, setMenu, diskspace, setDiskSpace } = useUploadAgent()

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
        <div className={`column is-one-fifth full-height custom-border is-flex is-flex-direction-column ${menu ? 'is-visible' : 'is-hidden-touch'}`}>
            <div className="is-flex is-justify-content-center my-4">
                <figure className="image is-128x128">
                    <img className="is-rounded" src={require('../assets/man.png')}/>
                </figure>
            </div>
            <div className="is-flex-grow-1 my-4">
                <aside className="menu">
                    <ul className="menu-list">
                        <li>
                            <a className="custom-font is-active" onClick={() => setMenu(!menu)}>
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
            <div className="my-6 is-hidden-desktop">
                <p className="custom-font has-text-weight-bold my-3">
                    <span className="icon mr-1">
                        <i className="fa-solid fa-hard-drive"></i>
                    </span>
                    Storage
                </p>
                <p className="custom-font is-size-7">{`${diskspace.free} GB of ${diskspace.size} GB Used`}</p>
                <progress className="progress is-primary" value={(diskspace.size-diskspace.free)/diskspace.size*100} max="100"></progress>
            </div>
        </div>
    )
}
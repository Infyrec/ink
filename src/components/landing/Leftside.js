import React, { useState } from 'react';

import { useUploadAgent } from './UploadAgent';

export default function Leftside(){
    let { uploadProgress, uploadFile } = useUploadAgent()

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
                            <a className="custom-font">
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
                            <a className="custom-font">
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
import 'react-circular-progressbar/dist/styles.css';

import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import axios from 'axios';

import { useUploadAgent } from './UploadAgent';
let storage = process.env.REACT_APP_STORAGE

export default function Rightside(){
    let { 
        uploadProgress, uploadFile, 
        trigger, setTrigger,
        menu, setMenu, 
        diskspace, setDiskSpace,
        details, setDetails
    } = useUploadAgent()

    return(
        <div className="column is-one-fifth full-height custom-border is-flex is-flex-direction-column px-5 is-hidden-touch">
            <div>
                <p className="custom-font has-text-weight-bold my-3">
                    <span className="icon mr-1">
                        <i className="fa-solid fa-upload"></i>
                    </span>
                    Progress
                </p>
                <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center my-3">
                    <div style={{ width: 120, height: 120 }}>
                        <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`} styles={buildStyles({pathColor: '#00d1b2'})}/>
                    </div>
                </div>
            </div>
            <div className="my-5">
                <p className="custom-font has-text-weight-bold my-3">
                    <span className="icon mr-1">
                        <i className="fa-solid fa-hard-drive"></i>
                    </span>
                    Storage
                </p>
                <p className="custom-font is-size-7">{`${diskspace.free} GB of ${diskspace.size} GB Used`}</p>
                <progress className="progress is-primary" value={(diskspace.size-diskspace.free)/diskspace.size*100} max="100"></progress>
            </div>
            <div>
                <p className="custom-font has-text-weight-bold my-3">
                    <span className="icon mr-1">
                        <i className="fa-solid fa-circle-info"></i>
                    </span>
                    Details
                </p>
                {
                    details != null ?
                    <>
                    <p className="is-size-6 custom-font">Name: {details.file}</p>
                    <p className="is-size-6 custom-font">Type: {details.type}</p>
                    <p className="is-size-6 custom-font">Size: {details.size}</p>
                    </>:null
                }
            </div>
        </div>
    )
}
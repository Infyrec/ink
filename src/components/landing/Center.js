import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useUploadAgent } from './UploadAgent';
let storage = process.env.REACT_APP_STORAGE

export default function Center(){
    let { uploadProgress, uploadFile, trigger, setTrigger } = useUploadAgent()
    let [fileList, setFileList] = useState([])
    let [toolTip, setToolTip] = useState(false)

    useEffect(() => {
        // To get list of files
        axios.get(`${storage}/readfiles`)
        .then((res) => {
            setFileList(res.data.files)
        })
        .catch((e) => {
            console.log('Error: ' + e);
        })
    }, [trigger])

    function downloadRequest(prop){
        setToolTip(!toolTip)
        window.open(`${storage}/download/?file=${prop.file}`)
    }

    function deleteRequest(prop){
        setToolTip(!toolTip)
        axios.post(`${storage}/delete`, prop)
        .then((res) => {
            console.log('File deleted successfully.');
            setTrigger(prev => prev + 1)
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function FileDataList(props){
        let { uid, file, type, size } = props
        return(
            <tr>
                <td>
                    <p className="custom-font is-size-6 has-text-centered">{file}</p>
                </td>
                <td>
                    <p className="custom-font is-size-6 has-text-centered">{type.split('/')[1]}</p>
                </td>
                <td>
                    <p className="custom-font is-size-6 has-text-centered">{size}</p>
                </td>
                <td>
                    <p className="has-text-centered">
                        <a className="mx-2"><span className="icon"><i className="fas fa-share-nodes" aria-hidden="true"></i></span></a>
                        <a onClick={() => downloadRequest(props)} className="mx-2">
                            <span className="icon"><i className="fas fa-download" aria-hidden="true"></i></span>
                        </a>
                        <a onClick={() => deleteRequest(props)} className="mx-2">
                            <span className="icon"><i className="fas fa-trash" aria-hidden="true"></i></span>
                        </a>
                    </p>
                </td>
            </tr>
        )
    }

    return(
        <div className="column full-height custom-border">
            {/* Search bar */}
            <div className="is-flex is-justify-content-space-between my-3">
                <div className="field">
                    <p className="control has-icons-left has-icons-right">
                    <input className="input" type="text" placeholder="Search" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-search"></i>
                    </span>
                    </p>
                </div>
                <div>
                    <p className="buttons">
                        <button className="button is-hidden-touch">
                            <span className="icon">
                                <i className="fa-solid fa-folder-plus"></i>
                            </span>
                        </button>
                        <button className="button is-hidden-touch">
                            <label>
                                <span className="icon">
                                    <i className="fa-solid fa-upload"></i>
                                    <input type='file' style={{display: "none"}} onChange={uploadFile}/>
                                </span>
                            </label>
                        </button>
                    </p>
                </div>
            </div>
            {/* All files */}
            <div className="my-3">
                <p className="custom-font is-size-5 has-text-weight-bold my-3">Files</p>
                {/* List view */}
                <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th className="has-text-centered">Name</th>
                            <th className="has-text-centered">Type</th>
                            <th className="has-text-centered">Size</th>
                            <th className="has-text-centered">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            fileList.map((data) => (
                                <FileDataList uid={data.uid} file={data.file} type={data.type} size={data.size} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useUploadAgent } from './UploadAgent';
let storage = process.env.REACT_APP_STORAGE

export default function Center(){
    let { uploadProgress, uploadFile, trigger } = useUploadAgent()
    let [fileList, setFileList] = useState([])

    useEffect(() => {
        // To get list of files
        axios.get(`${storage}/readdisk`)
        .then((res) => {
            setFileList(res.data.files)
            console.log(fileList);
        })
        .catch((e) => {
            console.log('Error: ' + e);
        })
    }, [trigger])


    function FileDataList(props){
        let { name, type, size } = props
        return(
            <tr>
                <td>
                    <span className="icon"><i className="fas fa-image" aria-hidden="true"></i></span>
                    <span className="custom-font is-size-6">{name}</span>
                </td>
                <td className="custom-font">{type}</td>
                <td className="custom-font">{size}</td>
                <td>
                    <a><span className="icon"><i className="fas fa-share-nodes" aria-hidden="true"></i></span></a>
                </td>
                <td>
                    <a><span className="icon"><i className="fas fa-ellipsis" aria-hidden="true"></i></span></a>
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
                            <th>Name</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Share</th>
                            <th>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            fileList.map((data) => (
                                <FileDataList name={data.name} type={data.type} size={data.size} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
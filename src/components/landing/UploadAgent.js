import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

let storage = process.env.REACT_APP_STORAGE

let UploadContext = createContext()

let metadata = null

export function useUploadAgent(){
    return useContext(UploadContext)
}

export function UploadAgent({ children }){
    let [uploadProgress, setUploadProgress] = useState(0)
    let [trigger, setTrigger] = useState(0)
    let [menu, setMenu] = useState(false)
    let [modal, setModal] = useState(false)
    let [details, setDetails] = useState(null)
    let [diskspace, setDiskSpace] = useState({
      free: 0,
      size: 0
    })

    useEffect(() => {
      // To get/fetch disk space
      axios.get(`${storage}/diskspace`)
      .then((res) => {
          setDiskSpace({
              free: Math.round(res.data.free),
              size: Math.round(res.data.size)
          })
      })
      .catch((e) => {
          console.log('Error : ' + e);
      })
  }, [trigger])

    const uploadFile = async (e) => {
      try{
        metadata = {
          uid: new Date().getTime(),
          file: e.target.files[0].name,
          size: parseInt(e.target.files[0].size / 1024**2) + ' MB',
          type: e.target.files[0].type,
          date: new Date().getDate().toString() + '/' + parseInt(new Date().getMonth()+1).toString() + '/' + new Date().getFullYear(),
          location: '/',
          meta: {
            lastModified: e.target.files[0].lastModified,
            lastModifiedDate: e.target.files[0].lastModifiedDate
          }
        }
  
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
    
        try {
          setMenu(false)
          setModal(true)
          const response = await axios.post(`${storage}/upload`, formData, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted)
              console.log(`Upload progress: ${percentCompleted}%`);
            },
          });
    
          if(response.data.status == 'success'){
            axios.post(`${storage}/registerUpload`, metadata)
            .then((res) => {
              setTrigger(prev => prev + 1)
              console.log('File uploaded successfully...!');
            })
            .catch((err) => {
              console.log(err);
            })
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
      catch(e){
        console.log('File not selected to upload.');
      }
    }

    return(
        <UploadContext.Provider value={{ 
          uploadProgress, uploadFile, 
          trigger, setTrigger, 
          menu, setMenu, 
          diskspace, setDiskSpace,
          modal, setModal,
          details, setDetails 
          }}>
            {children}
        </UploadContext.Provider>
    )
}
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

let storage = process.env.REACT_APP_STORAGE

let UploadContext = createContext()

export function useUploadAgent(){
    return useContext(UploadContext)
}

export function UploadAgent({ children }){
    let [uploadProgress, setUploadProgress] = useState(0)
    let [trigger, setTrigger] = useState(0)

    const uploadFile = async (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
    
        try {
          const response = await axios.post(`${storage}/upload`, formData, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted)
              console.log(`Upload progress: ${percentCompleted}%`);
            },
          });
    
          if(response.data.status == 'success'){
            setTrigger(prev => prev + 1)
            console.log('File uploaded successfully...!');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
    }

    return(
        <UploadContext.Provider value={{ uploadProgress, uploadFile, trigger }}>
            {children}
        </UploadContext.Provider>
    )
}
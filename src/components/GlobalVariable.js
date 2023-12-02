import React, { createContext, useContext, useState } from 'react';

let GlobalStore = createContext()

export function useGlobalVariable(){
    return useContext(GlobalStore)
}

export function GlobalVariable({ children }){
    let [email, updateEmail] = useState(null)
    let [uploadProgress, setUploadProgress] = useState(0)

    return(
        <GlobalStore.Provider value={{ email, updateEmail, uploadProgress, setUploadProgress }}>
            {children}
        </GlobalStore.Provider>
    )
}
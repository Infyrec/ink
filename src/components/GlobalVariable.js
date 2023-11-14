import React, { createContext, useContext, useState } from 'react';

let GlobalStore = createContext()

export function useGlobalVariable(){
    return useContext(GlobalStore)
}

export function GlobalVariable({ children }){
    let [email, updateEmail] = useState(null)

    return(
        <GlobalStore.Provider value={{ email, updateEmail }}>
            {children}
        </GlobalStore.Provider>
    )
}
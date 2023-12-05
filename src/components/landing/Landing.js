import './landing.css'

import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { UploadAgent } from './UploadAgent';

import Leftside from './Leftside';
import Center from './Center';
import Rightside from './Rightside';

let endpoint = process.env.REACT_APP_AUTHENTICATION // Authentication server
let connection = process.env.REACT_APP_CONNECTION // Socket server

export default function Landing(){
    let navigate = useNavigate()
    
    useEffect(() => {
        autoLogin()
    }, [])

    // To auto login
    function autoLogin(){
        axios.get(`${endpoint}/chat`, {withCredentials: true})
        .then((res) => {
            let status = res.data.verified
            if(status){
                navigate('/')
            }
        })
        .catch((err) => {
            navigate('/login')
        })
    }

    return(
        <UploadAgent>
            <section className="hero is-fullheight has-background-white">
                <div className="columns m-0">
                    {/* Left side */}
                    <Leftside />
                    {/* Center */}
                    <Center />
                    {/* Right side */}
                    <Rightside />
                </div>
            </section>
        </UploadAgent>
    )
}
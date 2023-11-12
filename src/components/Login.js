import './styles/authen.css'
import 'aos/dist/aos.css';
import login from './assets/elogin.svg'

import { Link, useNavigate } from "react-router-dom"
import { z } from "zod";
import AOS from 'aos';
import axios from 'axios';
import React, { useEffect, useState, useContext } from "react";
import { useGlobalVariable } from './GlobalVariable';

const credSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

let endpoint = 'http://192.168.0.213:3001'

export default function Login(){

    let navigate = useNavigate()
    let { email, updateEmail } = useGlobalVariable()
    let [cred, setCred] = useState({
        email: null,
        password: null
    })
    let [error, setError] = useState({
        status: false,
        message: 'Email or Password Incorrect !'
    })

    useEffect(() => {
        AOS.init();
    }, [])

    let processLogin = () => {
        try{
            let result = credSchema.parse(cred)
            
            axios.post(`${endpoint}/login`, cred, {withCredentials: true})
              .then((res) => {
                let status = res.data.verified
                if(status){
                    updateEmail(cred.email)
                    navigate('/chat')
                }                
              })
              .catch((err) => {
                setError({
                    status: true,
                    message: 'Invalid Username or Password'
                })

                setTimeout(() => {
                    setError({
                        status: false,
                        message: 'Email or Password Incorrect !'
                    })
                }, 2000)
              });
        }
        catch(e){
            console.log('Error: ' + e);
            setError({
                status: true,
                message: 'Email or Password Incorrect !'
            })

            setTimeout(() => {
                setError({
                    status: false,
                    message: 'Email or Password Incorrect !'
                })
            }, 2000)
        }
    }

    return(
        <section className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div className="columns is-flex is-justify-content-center is-align-items-center">
                <div className="column is-8">
                    <div class="card">
                        <div class="card-content">
                            <div class="content">
                                <h1 className="has-text-centered custom-font">Welcome to Ink</h1>
                                <div className="columns">
                                    <div className="column is-6-desktop is-hidden-mobile">
                                        <img src={login} width="500px" />
                                    </div>
                                    {/* Email login */}
                                    <div className="column is-justify-content-center is-flex is-align-items-center is-flex-direction-column is-6-desktop">
                                        <div className="field">
                                            <p className="control has-icons-left">
                                                <input className="input" type="email" placeholder="Email" onChange={(e) => setCred(prev => ({...prev, email: e.target.value}))}/>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-envelope"></i>
                                                </span>
                                            </p>
                                        </div>
                                        <div className="field">
                                            <p className="control has-icons-left">
                                                <input className="input" type="password" placeholder="Password" onChange={(e) => setCred(prev => ({...prev, password: e.target.value}))}/>
                                                <span className="icon is-small is-left">
                                                <i className="fas fa-lock"></i>
                                                </span>
                                            </p>
                                        </div>
                                        <div className="is-flex is-align-items-center is-justify-content-center">
                                            <button class="button custom-font custom-color has-text-white mx-1" onClick={processLogin}>Login</button>
                                        </div>
                                    </div>
                                </div>
                                <p className="has-text-centered custom-font is-size-7">New to Ink? <Link to="/signup">Create account</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                error.status ?
                <div className="error-box is-flex is-align-items-center p-4" data-aos="fade-left">
                    <p className="has-text-danger custom-font is-size-7">{error.message}</p>
                </div>:
                null
            }
        </section>
    )
}
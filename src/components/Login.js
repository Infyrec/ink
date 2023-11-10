import './styles/authen.css'
import login from './assets/elogin.svg'

import { Link } from "react-router-dom"
import { z } from "zod";
import React, { useEffect, useState, useContext } from "react";

const credSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export default function Login(){

    let [cred, setCred] = useState({
        email: null,
        password: null
    })

    let processLogin = () => {
        try{
            let result = credSchema.parse(cred)

            console.log('Creds ok');
        }
        catch(e){
            console.log('Error: ' + e);
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
        </section>
    )
}
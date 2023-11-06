import './styles/login.css'
import illustrate from './assets/illustrate.png'

import React, { useState, useEffect, useRef } from 'react'

export default function Login(){

    return(
        <section className="background hero is-fullheight is-flex is-justify-content-center is-align-items-center">
            <div className="columns is-flex is-justify-content-center is-align-items-center">
                <div className="column is-6-desktop is-6-tablet is-10-mobile">
                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                <h1 className="has-text-centered custom-font mb-4">Login</h1>
                                <div className="columns">
                                    {/* For image */}
                                    <div className="column is-hidden-mobile">
                                        <img src={illustrate}/>
                                    </div>
                                    {/* For input boxes */}
                                    <div className="column is-flex is-justify-content-center is-flex-direction-column">
                                        <div class="field" id="ewrapper">
                                            <p class="control has-icons-left has-icons-right">
                                                <input class="input" type="email" placeholder="Email" required />
                                                <span class="icon is-small is-left">
                                                <i class="fas fa-envelope"></i>
                                                </span>
                                            </p>
                                        </div>
                                        <div class="field">
                                            <p class="control has-icons-left">
                                                <input class="input" type="password" placeholder="Password" required id="password" />
                                                <span class="icon is-small is-left">
                                                <i class="fas fa-lock"></i>
                                                </span>
                                            </p>
                                        </div>
                                        <div class="my-2 custom-font">
                                            <a class="is-size-7">Forgot Password?</a>
                                        </div>
                                        <div class="has-text-centered my-2">
                                            <button class="button background has-text-white">Login</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="has-text-centered">
                                    <span class="custom-font is-size-7 has-text-weight-bold">Are you new? <a>Create Account</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
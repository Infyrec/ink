import './chat.css';

import React, { useState } from "react";
import { CommonAgent } from './CommonAgent';
import Leftside from './Leftside';
import Main from './Main';

export default function Chat(){
    let [error, setError] = useState({
        status: false,
        message: 'This feature not enabled !'
    })

    // To show features not enabled
    function notEnabled(){
        setError({
            status: true,
            message: 'This feature not enabled !'
        })

        setTimeout(() => {
            setError({
                status: false,
                message: 'This feature not enabled !'
            })
        }, 2000)
    }

    return(
        <CommonAgent>
            <section className="hero is-fullheight">
                <div className="columns m-0">
                    {/* Left column */}
                    <Leftside />
                    {/* Right column */}
                    <Main />
                </div>
            </section>
        </CommonAgent>
    )
}

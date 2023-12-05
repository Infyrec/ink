import './chat.css';

import React, { useState } from "react";
import { CommonAgent } from './CommonAgent';
import Leftside from './Leftside';
import Main from './Main';

export default function Chat(){
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

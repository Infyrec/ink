import './landing.css'

import React from "react";
import Leftside from './Leftside';
import Center from './Center';
import Rightside from './Rightside';

export default function Landing(){
    return(
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
    )
}
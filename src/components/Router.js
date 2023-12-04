import Login from "./Login";
import Signup from "./Signup";
import Landing from "./landing/Landing";
import Chat from "./chat/Chat";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" element={<Signup />}/>
                <Route path="/chat" element={<Chat />}/>
            </Routes>
        </BrowserRouter>
    )
}
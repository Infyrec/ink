import Login from "./Login";
import Signup from "./Signup";
import Chat from "./Chat";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/signup" element={<Signup />}/>
                <Route path="/chat" element={<Chat />}/>
            </Routes>
        </BrowserRouter>
    )
}
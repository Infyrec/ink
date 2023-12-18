const express = require('express')
const cors = require('cors')
const app = express()
const bcrypt = require('bcrypt');
const { sign, verify } = require('jsonwebtoken')
const cookieParse = require('cookie-parser')
const mongoose = require('mongoose');
const SignupModel = require('./schema/signupModel')
require('dotenv').config()

const dbConnect = process.env.DATABASE_URL
mongoose.connect(dbConnect);
const database = mongoose.connection

database.on('connected', () => {
    console.log('Database Connected.');
})

database.on('error', (e) => {
    console.log('Database Error: ' + e);
})

app.use(cors({
    origin: process.env.REQUEST_ORIGIN,    
    credentials: true
}))
app.use(express.json())
app.use(cookieParse())

app.get('/', (req, res) => {
    res.send('Auth server working fine !')
})

app.post('/uname', async(req, res) => {
    let { name } = req.body
    try{
        let result = await SignupModel.findOne({ username: name }).exec();
        if(result == null){
            res.status(200).send({status: 'available'})
        }
        else{
            res.status(200).send({status: 'unavailable'})
        }
    }
    catch(e){
        res.status(406).send({status: 'unavailable'})
    }
})


/*---------------------- Signup Route ----------------------*/
/* Web & App signup */
app.post('/signup', (req, res) => {
    let { username, email, password } = req.body

    bcrypt.hash(password, 10, async(err, hash) => {
        try{
            let data = new SignupModel({
                username: username,
                email: email,
                password: hash,
                verified: false
            })
    
            const dataToSave = await data.save();
            res.status(200).send({verified: false, status: 'success'})
        }
        catch(e){
            res.status(400).send({verified: 'unknown', status: 'failed'})
        }
    });
})


/*---------------------- Login Routes ----------------------*/
/* Web login */
app.post('/login', async(req, res) => {
    let { email, password } = req.body

    try{
        let result = await SignupModel.findOne({ email: email }).exec();

        if(result){
            bcrypt.compare(password, result.password, function(err, response) {
                if(response){
                    let data = {
                        username: result.username,
                        email: result.email
                    }
                    let accessToken = sign({email: email}, process.env.SECRET_KEY)
        
                    res.cookie('access-token', accessToken, {
                        maxAge: 3600000
                    })
                
                    res.status(200).send({verified: data.verified, status: 'success', userdata: data})
                }
    
                if(!response){
                    res.status(403).send({verified: false, status: 'invalid'})
                }
            });
        }
        else{
            res.status(404).send({verified: false, status: 'failed'})
        }
    }
    catch(e){
        res.status(500).send({verified: 'unknown', status: 'failed'})
    }
})

/* App login */
app.post('/app/login', async(req, res) => {
    let { email, password } = req.body
    try{
        let result = await SignupModel.findOne({ email: email }).exec();

        if(result){
            bcrypt.compare(password, result.password, function(err, response) {
                if(response){
                    let accessToken = sign({email: email}, process.env.SECRET_KEY, {expiresIn: 3600000})

                    let data = {
                        username: result.username,
                        email: result.email,
                        token: accessToken
                    }
                
                    res.status(200).send({verified: data.verified, status: 'success', token: data})
                }
    
                if(!response){
                    res.status(403).send({verified: false, status: 'invalid'})
                }
            });
        }
        else{
            res.status(404).send({verified: false, status: 'failed'})
        }
    }
    catch(e){
        res.status(500).send({verified: 'unknown', status: 'failed'})
    }
})


/*---------------------- Cookie Verify Routes Routes ----------------------*/
/* web verification */
app.get('/chat', (req, res) => {

    let token = req.cookies['access-token']

    if(token){
        try{
            let result = verify(token, process.env.SECRET_KEY)
            res.status(200).send({verified: true, status: 'success'})
        }
        catch(e){
            res.status(400).send('Cookie is not valid.')
        }
    }
    else{
        res.status(401).send('Cookie not found. Please login again !')
    }
})

/* App verification */
app.post('/app/verfiy', (req, res) => {

    let token = req.body.token

    if(token){
        try{
            let result = verify(token, process.env.SECRET_KEY)
            res.status(200).send({verified: true, status: 'success'})
        }
        catch(e){
            res.status(400).send('Cookie is not valid.')
        }
    }
    else{
        res.status(401).send('Cookie not found. Please login again !')
    }
})

/*---------------------- Logout route ----------------------*/
app.get('/logout', (req, res) => {
    res.clearCookie('access-token')
    res.status(200).send({verified: true, status: 'success'})
})


app.listen(3001, () => console.log('Authentication server running at port 3001 !'))
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
    origin: "http://192.168.0.213:3000",    
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
            res.status(200).send({verified: false, status: 'success', message: 'Account created.'})
        }
        catch(e){
            res.status(400).send({verified: 'unknown', status: 'failed', message: 'Account creation failed.'})
        }
    });
})

app.post('/login', async(req, res) => {
    let { email, password } = req.body

    try{
        let result = await SignupModel.findOne({ email: email }).exec();

        if(result){
            bcrypt.compare(password, result.password, function(err, response) {
                if(response){
                    let accessToken = sign({email: email}, process.env.SECRET_KEY)
        
                    res.cookie('access-token', accessToken, {
                        maxAge: 3600000
                    })
                
                    res.status(200).send({verified: true, status: 'success', message: 'Cookie Generated.'})
                }
    
                if(!response){
                    res.status(403).send({verified: false, status: 'invalid', message: 'Invalid email or password.'})
                }
            });
        }
        else{
            res.status(404).send({verified: false, status: 'failed', message: 'User not found.'})
        }
    }
    catch(e){
        res.status(500).send({verified: 'unknown', status: 'failed', message: 'Login failed.'})
    }
})

app.get('/chat', (req, res) => {

    let token = req.cookies['access-token']

    if(token){
        try{
            let result = verify(token, process.env.SECRET_KEY)
            res.status(200).send({verified: true, status: 'success', message: 'Cookie Validated.'})
        }
        catch(e){
            res.status(400).send('Cookie is not valid.')
        }
    }
    else{
        res.status(401).send('Cookie not found. Please login again !')
    }
})

app.listen(3001, () => console.log('Server running at port 3001 !'))
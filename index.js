const express = require('express')
const cors = require('cors')
const app = express()
const { sign, verify } = require('jsonwebtoken')
const cookieParse = require('cookie-parser')

app.use(cors())
app.use(express.json())
app.use(cookieParse())

app.get('/', (req, res) => {
    res.send('Auth server working fine !')
})

app.post('/signup', (req, res) => {
    let { username, email, password } = req.body
    console.log(req.body);
    res.send('Credentials received successfully !')
})

app.post('/login', (req, res) => {
    let { email, password } = req.body
    
    let accessToken = sign({email: email}, 'SECERTKEY')

    res.cookie('access-token', accessToken, {
        maxAge: 30000
    })

    res.send('Logged In Successfully !')
})

app.get('/profile', (req, res) => {

    let token = req.cookies['access-token']

    if(token){
        try{
            let result = verify(token, 'SECERTKEY')
            res.send('Cookie validated & logged in !')
        }
        catch(e){
            res.send('Cookie is not valid...!')
        }
    }
    else{
        res.send('Cookie not found. Please login again !')
    }
})

app.listen(5000, () => console.log('Server running at port 5000 !'))
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "*"
    }
});
require('dotenv').config()
const RefModel = require('./schema/RefModel')
const DataModel = require('./schema/dataModel');

app.use(cors())

const dbConnection = process.env.DATABASE_URL

mongoose.connect(dbConnection);
const database = mongoose.connection

database.once('connected', () => {
    console.log('Database Connected');
})

database.on('error', (error) => {
    console.log(error)
})

io.on("connection", (socket) => {
  console.log('User Connected: ' + socket.id);

  io.to(socket.id).emit('client-id', socket.id);

  //To update user online
  socket.on('update-online', (data) => {
    updateAsOnline(data)
  })
});

// To fetch the active users list
app.get('/activeusers', async(req, res) => {
    try{
        let usersList = await DataModel.find()

        res.status(200).json(usersList)
    }
    catch(e){
        res.status(404).send({status: 'failed', message: 'users not found'})
    }
})


httpServer.listen(3002, () => console.log('Socket server started at 3002'));

// To update online status on the database.
async function updateAsOnline(data){
    let { email, sockid } = data

    let result = await RefModel.findOne({ email: email }).exec();

    if(result){
        try{
            let data = new DataModel({
                username: result.username,
                email: result.email,
                sockid: sockid,
            })
    
            let output = await DataModel.findOneAndUpdate({email: result.email}, { sockid: sockid })
            
            if(!output){
                await data.save();
            }
        }
        catch(e){
            console.log(e);
        }
    }
}
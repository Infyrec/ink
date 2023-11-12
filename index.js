const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "*"
    }
});
require('dotenv').config()
const RefModel = require('./schema/RefModel')
const DataModel = require('./schema/dataModel')

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

httpServer.listen(3002, () => console.log('Socket server started at 3002'));


async function updateAsOnline(data){
    let result = await RefModel.findOne({ email: data.email }).exec();

    if(result){
        try{
            let data = new DataModel({
                username: result.username,
                email: result.email,
            })
    
            await data.save();
        }
        catch(e){
            console.log(e);
        }
    }
}
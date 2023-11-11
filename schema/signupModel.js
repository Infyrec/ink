const mongoose = require('mongoose');

const credSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String, 
        index: { unique: true }
    },
    email: {
        required: true,
        type: String,
        index: { unique: true }
    },
    password: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('User', credSchema)
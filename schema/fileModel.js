const mongoose = require('mongoose');

const credSchema = new mongoose.Schema({
    uid: {
        required: true,
        type: String, 
        index: { unique: true }
    },
    file: {
        required: true,
        type: String,
    },
    extension: {
        required: true,
        type: String
    },
    type: {
        required: true,
        type: String
    },
    size: {
        required: true,
        type: String
    },
    date: {
        required: true,
        type: String
    },
    location: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Upload', credSchema)
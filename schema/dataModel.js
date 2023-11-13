const mongoose = require('mongoose');

const credSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    sockid: {
        type: String
    },
})

module.exports = mongoose.model('Online', credSchema)
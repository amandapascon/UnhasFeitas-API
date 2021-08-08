const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true
    },
})

mongoose.model('Time', UserSchema)
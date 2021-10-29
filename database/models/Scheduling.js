const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    services: {
        type: Array,
        required: true,
    },
    status:{
        type: String,
        default: "scheduled",
    }
})

mongoose.model('Scheduling', UserSchema)
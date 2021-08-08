const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pack:{
        type: String,
        default: null,
    },
    status:{
        type: String,
        default: "unused",
    },
    remainingPack: {
        type: Number,
        default: null,
    },
    role: {
        type: String,
        default: false,
    }
})

mongoose.model('User', UserSchema)
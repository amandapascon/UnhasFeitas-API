const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const requireDir = require('require-dir')

dotenv.config()

const app = express()

//Conecção com o db
mongoose.connect(
    'mongodb+srv://amandapascon:santos10A-@unhasfeitas.qtepo.mongodb.net/UnhasFeitas?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false }
)
requireDir('./database/models')

//Configuração da porta onde o back vai rodar
const port = process.env.PORT || 8080
app.listen(port)

//Autorização para acessar links externos
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})
app.use(cors({allowedHeaders: ['Content-Type', 'Authorization']}))

//Interpretador JSON
app.use(express.json())

//Chamando o arquivo de Rotas
app.use('/', require('./routes'))

console.info(`backend app listening at port ${port}`)
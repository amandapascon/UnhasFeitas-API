const express = require('express')
const routes = express.Router()

const authenticate = require('./middlewares/authenticate')

const userController = require('./controllers/userController')
const packController = require('./controllers/packageController')
const paymentController = require('./controllers/paymentController')
const timeController = require('./controllers/timeController')
const schedulingController = require('./controllers/schedullingController')

//rotas
routes.post('/user', userController.newUser)
routes.put('/login', userController.loginUser)
routes.get('/user', authenticate.Auth, userController.showUser)
routes.get('/users', authenticate.AuthAdmin, userController.showUsers)
routes.delete('/user', authenticate.Auth, userController.deleteUser)
routes.get('/my_account', userController.my_account)

routes.post('/package', authenticate.AuthAdmin, packController.newPack)
routes.delete('/package/:id', authenticate.AuthAdmin, packController.deletePack)
routes.get('/package', authenticate.Auth, packController.showPacks)

routes.post('/payment/package/:id_pack', authenticate.Auth, paymentController.newPayment)
routes.patch('/payment', authenticate.Auth, paymentController.cancelPayment)
routes.get('/payment', authenticate.AuthAdmin, paymentController.showPayments)
routes.patch('/payment/:id_user', authenticate.AuthAdmin, paymentController.checkPayment)

routes.post('/time', authenticate.AuthAdmin, timeController.newTime)
routes.get('/time', authenticate.Auth, timeController.showTime)
routes.delete('/time/:id_time', authenticate.AuthAdmin, timeController.deleteTime)

routes.post('/scheduling', authenticate.Auth, schedulingController.newScheduling)
routes.get('/schedulings', authenticate.AuthAdmin, schedulingController.showScheduling)
routes.get('/scheduling', authenticate.Auth, schedulingController.schedulingUser)
routes.get('/historic', authenticate.Auth, schedulingController.HistoricUser)
routes.patch('/scheduling/:id_scheduling', authenticate.Auth, schedulingController.cancelScheduling)
routes.patch('/checkin/:id_scheduling', authenticate.AuthAdmin, schedulingController.checkin)

module.exports=routes

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

const User = mongoose.model('User')
const Package = mongoose.model('Package')
const Payment = mongoose.model('Payment')
const Scheduling = mongoose.model('Scheduling')
const Time = mongoose.model('Time')

module.exports = {
    //rota para criar novo usuario
    async newUser(req, res){
        const user = await User.create(req.body)
        return res.json(user)
    },
    //rota para exibir todos os usuarios cadastrados (Admin)
    async showUser(req, res){
        const user = await User.find();
        return res.json(user)
    },
    //rota para exibir um usuario de acordo com o id
    async showUserId(req, res){
        const {id} = req.params
        
        const user = await User.findById({_id: id});

        if(user)
            return res.json(user)
        else
            return res.json('Erro')

    },
    //checkin(adm pega o plano atual atualiza o usageHistory e o remainingPack de acordo com o services
    async checkinUser (req, res){
        const {id} = req.params

        const scheduling = await Scheduling.findById({_id: id})

        let update = []

        if(scheduling.services == "mão")
            update = {$inc: {'remainingPack' : -1}, '$push': {'usageHistory': {'$each': [scheduling.services]}}}
        else
        update = {$inc: {'remainingPack' : -2}, '$push': {'usageHistory': {'$each': [scheduling.services]}}}

        const user = await User.findByIdAndUpdate({_id: scheduling.user}, update, {new: true})

        return res.json(user) 
    },
    //rota para logar usuario
    async loginUser (req, res){
        const {phone, password} = req.body
        
        const user = await User.findOne({phone: phone})

        if(user && (password == user.password)){
            const token = jwt.sign({name: user.name, role: user.role}, process.env.SECRET)
            return res.json({token, name: user.name, admin: user.role == 'admin'})
        }else{
            return res.json({err: 'auth'})
        }
    },
    //rota para deletar user
    async deleteUser(req, res){
        const {id} = req.params
        const user = await User.findByIdAndDelete({_id: id})

        if(user)
            return res.json('Ok')
        else
            return res.json('Erro')
    }, 
    //rota para pegar o jwt
    async my_account(req, res){
        jwt.verify(req.headers.auth, process.env.SECRET, function(err, decoded) {
            if (err)
                return res.json('Erro')
            
            //next()
            return res.json(decoded)
            //console.log(decoded)
          });
    },

    //rota para solicitacao de pagamento
    async newPayment(req, res){
        const {id_user, id_pack} = req.params
        const payment = await Payment.create({user: id_user, pack: id_pack})
        return res.json(payment)
    },
    //rota para exibir todas as solicitacoes de pagamento (Admin)
    async showPayment(req, res){
        const payment = await Payment.find()
        return res.json(payment)
    },
    //rota para exibir excluir solicitacoes de pagamento(Admin)
    async deletePayment(req, res){
        const {id} = req.params
        const payment = await Payment.findOneAndDelete({_id: id})
        return res.json(payment)
    },
    //rota para confirmar pagamento (coloca aquele pacote no user)
    async checkPayment(req, res){
        const {id} = req.params

        const payment = await Payment.findById({_id:id});

        const package = await Package.findById({_id:payment.pack})

        let update = []

        update = {$set: {'pack': package._id, 'usageHistory': [], 'remainingPack':package.duration}}

        const user = await User.findByIdAndUpdate({_id: payment.user}, update, {new: true})

        return res.json(user) 
    },

    //rota para novo agendamento
    async newScheduling(req, res){
        const {id} = req.params
        const {date, services} = req.body
        const scheduling = await Scheduling.create({user: id, date: date, services: services})
        
        return res.json(scheduling)
        
        let update = []

        update = {$set: {'available': false}}

        const time = await Time.find({time: date})

        await Time.findByIdAndUpdate({_id: time._id}, update, {new: true})

        return res.json(scheduling)
    },
    //rota para exibir todos agendamentos (Admin)
    async showScheduling(req, res){
        const scheduling = await Scheduling.find()
        return res.json(scheduling)
    },
    //rota para exibir agendamento daquele user
    async showSchedulingUser(req, res){
        const user = req.body
        const scheduling = await Scheduling.findOne({user: user})
        return res.json(scheduling)
    },
    //rota para exibir excluir agendamento (Admin)
    async deleteScheduling(req, res){
        const user = req.body
        const scheduling = await Scheduling.findOneAndDelete({user: user})
        return res.json(scheduling)
    }, 

    //criar novo pacote (Admin)
    async newPack(req, res){
        const package = await Package.create(req.body)
        return res.json(package)
    },
    //rota para exibir todos os planos cadastrados
    async showPacks (req, res){
        const package = await Package.find()
        return res.json(package)
    },
    //rota para exibir determinado pacote
    async showPackId(req, res){
        const id = req.params
        const package = await Package.find({_id: id})
        return res.json(package)
    },
    //deletar pacote (Admin)
    async deletePack(req, res){
        const {id} = req.params
        const package = await Package.findByIdAndDelete({_id: id})

        if(package)
            return res.json('Ok')
        else
            return res.json('Erro')
    },    

    //criar novo horario (Admin)
    async newTime(req, res){
        const time = await Time.create(req.body)
        return res.json(time)
    },
    //rota para exibir todos os horarios cadastrados
    async showTimes (req, res){
        const time = await Time.find()
        return res.json(time)
    },
    //deletar horario (Admin)
    async deleteTime(req, res){
        const {id} = req.params
        const time = await Time.findByIdAndDelete({_id: id})

        if(time)
            return res.json('Ok')
        else
            return res.json('Erro')
    }    
    
}
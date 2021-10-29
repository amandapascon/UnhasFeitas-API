const mongoose = require('mongoose')

const Package = mongoose.model('Package')
const User = mongoose.model('User')

module.exports = {
    //user payment (ask for a new start package)
    async newPayment(req, res){
        const {id_pack} = req.params

        const user = await User.findById({_id: req.user.id}).exec()
        if(!user){
            return res.status(404).send()
        }

        const pack = await Package.findOne({_id: id_pack}).exec()
        if(!pack){
            return res.status(404).send()
        }

        if(user.status === "unused" || user.status === "finished"){
            let update = []
            update = {$set: {'status': "requested", 'pack': pack._id}}
            const updateUser = await User.findByIdAndUpdate({_id: user._id}, update, {new: true}).exec()
            if(!updateUser){
                return res.status(404).send()
            }else{
                return res.status(200).json(updateUser)
            }
        }else{
            return res.status(404).send()
        }
    },

    //cancel some user payment
    async cancelPayment(req, res){
        const user = await User.findById({_id: req.user.id}).exec()
        if(!user){
            return res.status(404).send()
        }

        if(user.status === "requested"){
            let update = []
            update = {$set: {'status': "unused",  'pack': null}}
            const updateUser = await User.findByIdAndUpdate({_id: user._id}, update, {new: true}).exec()
            if(!updateUser){
                return res.status(404).send()
            }else{
                return res.status(200).json(updateUser)
            }  
        }else{
            return res.status(404).send()
        }
    },

    //cancel some user payment
    async cancelPaymentById(req, res){
        const user = await User.findById({_id: req.params.id}).exec()
        if(!user){
            return res.status(404).send()
        }

        if(user.status === "requested"){
            let update = []
            update = {$set: {'status': "unused",  'pack': null}}
            const updateUser = await User.findByIdAndUpdate({_id: user._id}, update, {new: true}).exec()
            if(!updateUser){
                return res.status(404).send()
            }else{
                return res.status(200).json(updateUser)
            }  
        }else{
            return res.status(404).send()
        }
    },

    //show all users payments
    async showPayments(req, res){
        const users = await User.find().where('status').equals("requested").exec()

        if(!users)
            return res.status(404).send()
        else
            return res.status(200).json(users)
    },

    
    //check payment (admin)
    async checkPayment(req, res){
        const {id_user} = req.params
        const user = await User.findById({_id: id_user}).exec()
        if(!user){
            return res.status(404).send()
        }

        if(user.status === "requested"){
            const package = await Package.findById({_id: user.pack}).exec()
            if(!package)
                return res.status(404).send()
            let update = []
            update = {$set: {'status': "using", 'remainingPack': package.duration}}
            const updateUser = await User.findByIdAndUpdate({_id: user._id}, update, {new: true}).exec()
            if(!updateUser){
                return res.status(404).send()
            }else{
                return res.status(200).json(updateUser)
            }  
        }else{
            return res.status(404).send()
        }
    }
}
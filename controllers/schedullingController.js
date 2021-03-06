const mongoose = require('mongoose')
const moment = require('moment')

const Scheduling = mongoose.model('Scheduling')
const User = mongoose.model('User')
const Time = mongoose.model('Time')

module.exports = {
    //new scheduling
    async newScheduling(req, res){
        const {date, services} = req.body

        console.log(moment(date).format(), services)

        if(!services || !date)
            return res.status(404).send()

        //verificando se user ja tem algum agendamento "scheduled"
        const schedulingFound = await Scheduling.findOne({user: req.user.id}).where('status').equals("scheduled").exec()
        if(schedulingFound)
            return res.status(404).send()

        //verificando se tem remainingPack suficiente
        const user = await User.findById({_id: req.user.id}).exec()
        if(!user)
            return res.status(404).send()
            
        if(services=="Mão,Pé" || services=="Pé,Mão"){

            if(user.remainingPack<2)
                return res.status(404).send()
            
            const nextTimeFound = await Time.findOne({date: moment(moment(date).add(1, 'hour')).format()}).exec()
            if(!nextTimeFound)
                return res.status(404).send()
            
            let update = []
            update = {$set: {'available': false}}
            const time1 = await Time.findOneAndUpdate({date: moment(date).format()}, update, {new: true}).exec()
            if(!time1)
                return res.status(404).send()
            const time2 = await Time.findOneAndUpdate({date: moment(moment(date).add(1, 'hour')).format()}, update, {new: true}).exec()
            if(!time2)
                return res.status(404).send()           

            //datas consecutivas
            
        }else if(services=="Mão" || services=="Pé"){
            if(user.remainingPack<1)
                return res.status(404).send()
            let update = []
            update = {$set: {'available': false}}
            const time = await Time.findOneAndUpdate({date: date}, update, {new: true}).exec()
            if(!time)
                return res.status(404).send()
        }
        
        const scheduling = await Scheduling.create({date: date, user: req.user.id, services: services})
        if(!scheduling)
                return res.status(404).send()
        else
            return res.status(200).json(scheduling)
    },

    //cancel scheduling
    async cancelScheduling(req, res){
        const {id_scheduling} = req.params

        const schedulingFound = await Scheduling.findById({_id: id_scheduling}).where('status').equals("scheduled").exec()  
        if(!schedulingFound)
            return res.status(404).send()        

        if(schedulingFound.services=="Mão,Pé" || schedulingFound.services=="Pé,Mão"){
            let update = []
            update = {$set: {'available': true}}
            const time1 = await Time.findOneAndUpdate({date: moment(schedulingFound.date).format()}, update, {new: true}).exec()
            if(!time1)
                return res.status(404).send()
            const time2 = await Time.findOneAndUpdate({date: moment(moment(schedulingFound.date).add(1, 'hour')).format()}, update, {new: true}).exec()
            if(!time2)
                return res.status(404).send()  
            
            let updateScheduling = []
            updateScheduling = {$set: {'status': "canceled"}}
            const scheduling = await Scheduling.findOneAndUpdate({_id: id_scheduling}, updateScheduling, {new: true}).exec()
            if(scheduling)
                return res.status(200).send()
            else
                return res.status(404).send()

        }else{
            let update = []
            update = {$set: {'available': true}}
            const time = await Time.findOneAndUpdate({date: moment(schedulingFound.date).format()}, update, {new: true}).exec()
            if(!time)
                return res.status(404).send()
            
            let updateScheduling = []
            updateScheduling = {$set: {'status': "canceled"}}
            const scheduling = await Scheduling.findOneAndUpdate({_id: id_scheduling}, updateScheduling, {new: true}).exec()
            if(scheduling)
                return res.status(200).send()
            else
                return res.status(404).send()
        }
    },

    //user scheduling avaible
    async schedulingUser(req, res){
        const scheduling = await Scheduling.find({user: req.user.id}).where('status').equals("scheduled").exec()
        if(!scheduling)
            return res.status(404).send()
        else
            return res.status(200).json(scheduling[0])
    },

    //user scheduling historic
    async HistoricUser(req, res){
        const scheduling = await Scheduling.find({user: req.user.id}).where('status').equals("confirmed").exec()
        if(!scheduling)
            return res.status(404).send()
        else
            return res.status(200).json(scheduling)
    },
  
    //show all scheduling (admin)
    async showScheduling(req, res){
        const scheduling = await Scheduling.find().where('status').equals("scheduled").populate("user").exec()  
        if(!scheduling)
            return res.status(404).send()
        else
            return res.status(200).json(scheduling)
    },

    //checkin (admin) -> change remainingPack
    async checkin(req, res){
        const {id_scheduling} = req.params

        let scheduling = await Scheduling.findById({_id: id_scheduling}).where('status').equals("scheduled").exec()  
        if(!scheduling)
            return res.status(404).send()

        let user = await User.findById({_id: scheduling.user}).exec() 
        if(!user)
            return res.status(404).send()
        
        let updateUser = []
        let updateScheduling = []
        if(scheduling.services == "Pé e Mão"){
            return res.status(404).send()

        }else{
            /* update = {$inc: {'remainingPack' : -1}, '$push': {'usageHistory': {'$each': [scheduling.services]}, 'dateHistory': {'$each': [scheduling.date]}}} */
            updateUser = {$inc: {'remainingPack' : -1}}
            updateScheduling = {$set: {'status': "confirmed"}}
        }
        
        user = await User.findByIdAndUpdate({_id: scheduling.user}, updateUser, {new: true}).exec()
        if(!user)
            return res.status(404).send()
        
        scheduling = await Scheduling.findByIdAndUpdate({_id: scheduling._id}, updateScheduling, {new: true}).exec()
        if(!scheduling)
            return res.status(404).send()

        if(user.remainingPack == 0){
            update = {$set: {'status': "finished"}}
            user = await User.findByIdAndUpdate({_id: scheduling.user}, update, {new: true}).exec()
            if(!user)
                return res.status(404).send()
            else
                return res.status(200).json(user)
        }else
            return res.status(200).json(user)
    },
}
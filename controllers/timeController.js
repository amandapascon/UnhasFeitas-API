const mongoose = require('mongoose')

const Time = mongoose.model('Time')

module.exports = {
    //new time
    async newTime(req, res){
        const {date} = req.body

        if(!(new Date() < new Date(date)))
            return res.status(404).send()
        
        const timeFound = await Time.findOne({date: date}).exec()
        if(timeFound){
            return res.status(404).send()
        }

        const time = await Time.create({date: date})
        if(!time)
            return res.status(404).send()
        else
            return res.status(200).send()    
    },

    //show all avaiables times
    async showTime(req, res){
        const time = await Time.find().where('available').equals(true).sort({date: 1})

        /* date = "2021-10-23T13:00:00Z"
        
        date_time = new Date(date)

        date_time2 = date_time.setHours(date_time.getHours()+1)

        date2 = date_time2.toString()

        console.log(date_time2.toTimeString());

        const time = await Time.find().where('date').equals(date)
        if(!time)
            return res.status(404).send()

        const time2 = await Time.find().where('date').equals(date2)
        if(!time2)
            return res.status(404).send()
        
        return res.status(200).json({time, time2}) */

        if(!time)
            return res.status(404).send()
        else
            return res.status(200).json(time)
    },

    //delete time (admin)
    async deleteTime(req, res){
        const {id_time} = req.params
        const time = await Time.findByIdAndDelete({_id: id_time})
        if(time)
            return res.status(200).send()
        else
            return res.status(404).send()
    }
}
const mongoose = require('mongoose')

const Package = mongoose.model('Package')

module.exports = {
    //new pack
    async newPack(req, res){
        const {name, description, duration} = req.body;

        const packFound = await Package.findOne({name: name}).exec()
        if(packFound)
            return res.status(404).send()

        const pack = await Package.create({name: name, description: description, duration: duration})
        return res.json(pack) 
    },

    //delete pack
    async deletePack(req, res){
        const {id} = req.params

        const pack = await Package.findByIdAndDelete({_id: id})

        if(pack)
            return res.status(200).send()
        else
            return res.status(404).send()
    },

    //show all packs 
    async showPacks(req, res){
        const pack = await Package.find()

        if(pack)
            return res.status(200).json(pack)
        else
            return res.status(404).send()
    }  
}

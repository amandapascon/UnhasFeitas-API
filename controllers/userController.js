const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const User = mongoose.model('User')

module.exports = {
    //create new user
    async newUser(req, res){
        const {name, phone, password, role} = req.body;
        const passwordHash = await bcrypt.hash(password, 8);

        const userFound = await User.findOne({phone: phone}).exec()
        if(userFound){
            return res.status(404).send()
        }

        if(!role){
            const user = await User.create({name: name, phone: phone, password: passwordHash})
            return res.status(200).json(user)
        }else{
            const user = await User.create({name: name, phone: phone, password: passwordHash, role: role})
            return res.status(200).json(user) 
        }
    },

    //user login
    async loginUser(req, res){
        const {phone, password} = req.body;

        const userFound = await User.findOne({phone: phone}).exec()
        if(!userFound){
            return res.status(404).send()
        }

        const mathPassword = await bcrypt.compare(password, userFound.password)
        if(!mathPassword){
            return res.status(404).send()
        }

        const token = jsonwebtoken.sign({
            id: userFound._id,
            role: userFound.role
        }, "2582cf5038bbd26c8bbf359a25de52e7", {
            subject: userFound.phone,
            expiresIn: "1d"
        })

        return res.status(200).json({token, name: userFound.name, phone: userFound.phone, admin: userFound.role}) 
    },

    //show an user
    async showUser(req, res){
        const user = await User.findById({_id: req.user.id})
        if(!user){
            return res.status(404).send()
        }
        return res.status(200).json(user)        
    },    

    //show all users (admin)
    async showUsers(req, res){
        const user = await User.find()
        if(!user){
            return res.status(404).send()
        }
        return res.status(200).json(user) 
    },

    //delete user    
    async deleteUser(req, res){
        const user = await User.findByIdAndDelete({_id: req.user.id})
        if(user)
            return res.status(200).send()
        else
            return res.status(404).send()
    },

    //check token
    async my_account(req, res){
        const authToken = req.headers.authorization;
        if(!authToken){
            return res.status(401).send()
        }
        
        const [, token] = authToken.split(" ");

        jsonwebtoken.verify(token, "2582cf5038bbd26c8bbf359a25de52e7", (err, decoded) => {
            if (err) {
              return res.status(401).send()
            } else {
              return res.status(200).json(decoded)
            }
          })
    }
}
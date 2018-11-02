const mongoose = require('../util/mongoose')
const bcrypt = require('bcrypt')
const { hash } = require('../util')



var UserModel = mongoose.model('users', new mongoose.Schema({
    username: String,
    password: String,
    number: String,
    section:String,
    authority:String,
    signupTime: String,
    signupTime:String
}));


//存用户
const signup =  ({username,password,number,section}) =>{
    // let _password =  hash(password) ;
    return new UserModel({
        username,
        password,
        signupTime: Date.now(),
        authority:"2",
        section,
        number
    })
    .save()
    .then((results) => {
        let { _id, username, number } = results
        return { _id, username, number }
    })
    .catch(() => {
        return false
    })
}


// 通过用户名验证是否有这个用户
const IsUser = (username) => {
    return UserModel
    .find({ username })
    .then((results) => {
        return results
    })
    .catch(() => {
        return false
    })
            
}

const signin = (pwd, { password }) => { 
    return (pwd == password) 
}


module.exports = {
    signup, 
    IsUser,
    signin
}
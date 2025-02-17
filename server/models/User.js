const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    id:Number,
    name: String,
    lastName: String,
    email: String,
    age: Number,
    gender: String,
    phone: String,
    password: String,
    role: {
        type: String,
        default: "visitor"
    }
})

const UserModel= mongoose.model("users", UserSchema)
module.exports = UserModel
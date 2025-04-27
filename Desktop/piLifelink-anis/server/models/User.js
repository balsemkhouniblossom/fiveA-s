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
    bloc: String,
    speciality: {
        type: String,
        enum: [
            "Cardiologie", "Neurologie", "Pédiatrie", "Gynécologie-obstétrique", 
            "Traumatologie", "Pneumologie", "Néphrologie", "Gastro-entérologie", 
            "Oncologie", "Psychiatrie", "Radiologie", "Anesthésie-réanimation"
        ],
        default: undefined 
    },
    medicalHistory: String,
    testResults: String,
    isVerifyed:{
        type:Boolean,
        default:false
    },
    role: {
        type: String,
        enum: ["ADMIN", "PATIENT", "NURSE", "DOCTOR"],
        default: "PATIENT"
    },
    status: String,
    images: [String],
    files: [String],  // Champ pour stocker plusieurs images (tableau d'URLs)
    verificationCode: String,
    verificationCodeExpires: Date 
})

const UserModel= mongoose.model("users", UserSchema)
module.exports = UserModel
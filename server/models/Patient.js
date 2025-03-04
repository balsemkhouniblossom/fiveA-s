const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema({
    medicalHistory: String,
    testResults: String,
    status: {
        type: String,
        enum: [StatusEnum.URGENT, StatusEnum.APPOINTMENT]
    }
});

const PatientModel = mongoose.model("patients", PatientSchema);
module.exports = PatientModel;

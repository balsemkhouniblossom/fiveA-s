const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema({
    specialty: String
});

const DoctorModel = mongoose.model("doctors", DoctorSchema);
module.exports = DoctorModel;

const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
    date: Date,
    time: Date,
    status: {
        type: String,
        enum: [StatusEnum.PENDING, StatusEnum.CONFIRMED, StatusEnum.CANCELED]
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }
});

const AppointmentModel = mongoose.model("appointments", AppointmentSchema);
module.exports = AppointmentModel;

const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "canceled"],
        default: "pending"
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }
});

const AppointmentModel = mongoose.model("appointments", AppointmentSchema);
module.exports = AppointmentModel;

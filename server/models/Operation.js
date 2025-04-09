const mongoose = require("mongoose");

const OperationSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    description: String,
 

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rooms",
        required: true

    }
});

const OperationModel = mongoose.model("operations", OperationSchema);
module.exports = OperationModel;

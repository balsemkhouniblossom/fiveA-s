const mongoose = require('mongoose')

const AmbulanceSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    model: String,
    serie: String,
    contact: String,
    location : String,
    status: {
        type: String,
        enum: ["BUSY", "AVAILABLE"],
        default: "AVAILABLE"
    },
})

const AmbulanceModel = mongoose.model("ambulances", AmbulanceSchema);
module.exports = AmbulanceModel;

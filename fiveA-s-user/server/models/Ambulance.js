const mongoose = require('mongoose')

const AmbulanceSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    location : String,
    status: {
        type: String,
        enum: [StatusEnum.AVAILABLE, StatusEnum.BUSY]
    }
});

const AmbulanceModel = mongoose.model("ambulances", AmbulanceSchema);
module.exports = AmbulanceModel;

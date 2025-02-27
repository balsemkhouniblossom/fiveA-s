const mongoose = require('mongoose')

const ComplaintSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    description: String,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
});

const ComplaintModel = mongoose.model("complaints", ComplaintSchema);
module.exports = ComplaintModel;

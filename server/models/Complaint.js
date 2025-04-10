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
    },
    date: {
        type: Date,
        default: Date.now // Automatically sets the current date if not provided
    },

    status: {
        type: String,
        enum: ["Pending", "In Treatment", "Resolved"], // Define possible statuses
        default: "Pending" // Set default status to "Pending"
    }

});

const ComplaintModel = mongoose.model("complaints", ComplaintSchema);
module.exports = ComplaintModel;
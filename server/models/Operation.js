const mongoose = require("mongoose");

const OperationSchema = new mongoose.Schema({
    description: String,
    date: Date,
    status: {
        type: String,
        enum: ["AVAILABLE", "BUSY"]
    }
});

const OperationModel = mongoose.model("Operation", OperationSchema);
module.exports = OperationModel;

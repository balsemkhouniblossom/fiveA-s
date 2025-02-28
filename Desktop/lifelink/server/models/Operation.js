const mongoose = require('mongoose')

const OperationSchema = new mongoose.Schema({
    description: String,
    date: Date,
    status: {
        type: String,
        enum: [StatusEnum.AVAILABLE, StatusEnum.BUSY]
    }
});

const OperationModel = mongoose.model("operations", OperationSchema);
module.exports = OperationModel;

const mongoose = require('mongoose')

const NurseSchema = new mongoose.Schema({
    bloc: String
});

const NurseModel = mongoose.model("nurses", NurseSchema);
module.exports = NurseModel;

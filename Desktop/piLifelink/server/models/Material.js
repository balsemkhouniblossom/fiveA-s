const mongoose = require('mongoose')

const MaterialSchema = new mongoose.Schema({
    name: String,
    quantity: Number
});

const MaterialModel = mongoose.model("materials", MaterialSchema);
module.exports = MaterialModel;


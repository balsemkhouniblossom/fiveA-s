const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    roomNumber: String,
    description: String
});

const RoomModel = mongoose.model("rooms", RoomSchema);
module.exports = RoomModel;

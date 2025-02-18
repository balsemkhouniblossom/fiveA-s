const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    roomNumber: String,
    availability: Boolean
});

const RoomModel = mongoose.model("rooms", RoomSchema);
module.exports = RoomModel;

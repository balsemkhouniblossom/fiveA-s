const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: String,
  availability: Boolean
});

const Room = mongoose.model("room", RoomSchema);
module.exports = Room;
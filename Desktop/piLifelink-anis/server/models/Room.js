const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: String,
  availability: Boolean,
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Room = mongoose.model("room", RoomSchema);
module.exports = Room;
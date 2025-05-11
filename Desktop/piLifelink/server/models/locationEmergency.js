const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  lng: {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false 
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', default: null }

});

module.exports = mongoose.model('Location', LocationSchema);

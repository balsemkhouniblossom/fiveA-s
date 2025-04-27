const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({

  lng: {
    type: Number,
  },
  lat: {
    type: Number,
  }
});

module.exports = mongoose.model('Location', LocationSchema);

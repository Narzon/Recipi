const mongoose = require('mongoose');
const MarkerSchema = new mongoose.Schema({
  recipe: {
    type: String,
    default: ''
  },
  restaurant: {
    type: String,
    default: ''
  },
  city : {
      type: String,
      default: ''
  },
  location: {
      type: Object,
      default: {}
  }
});
module.exports = mongoose.model('Marker', MarkerSchema);
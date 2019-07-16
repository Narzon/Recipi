const mongoose = require('mongoose');
const RecipeSchema = new mongoose.Schema({
  user: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  ingredients: {
    type: Array,
    default: []
  },
  description: {
    type: String,
    default: ""
  },
  instructions: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  longDescription: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    default: 0
  },
  restaurant: {
    type: Object,
    default: {}
  }
});
module.exports = mongoose.model('Recipe', RecipeSchema);
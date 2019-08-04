const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  user: {
    type: String,
    default: ''
  },
  recipe: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    default: ''
  },
  date: {
      type: Object,
      default: {}
  }
});
module.exports = mongoose.model('Comment', CommentSchema);
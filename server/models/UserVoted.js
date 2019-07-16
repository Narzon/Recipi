const mongoose = require('mongoose');
const UserVotedSchema = new mongoose.Schema({
  user: {
    type: String,
    default: ''
  },
  recipeTitle: {
    type: String,
    default: ''
  },
  didVote: {
    type: Boolean,
    default: true
  }
});
module.exports = mongoose.model('UserVoted', UserVotedSchema);
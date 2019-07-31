const UserVoted = require("../models/UserVoted");
require("dotenv").config();
var jwt = require('jsonwebtoken');

function create(req, res, next) {
  let { user, recipeTitle, dontChange, token } = req.body;
  try {
    let userData = jwt.verify(token, process.env.secretKey)
  } catch (err) {
    return res.send({
      success: false,
      message: "Bad, verification failed"
    })
  }
  UserVoted.find({
    user: user,
    recipeTitle: recipeTitle
  }, (err, result) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    } else if (result[0]) {
        return res.send({
            success: false,
            message: 'Error: Already exists/Already voted.'
            });
    } else {
        const newUserVoted = new UserVoted();
        newUserVoted.recipeTitle = recipeTitle
        newUserVoted.user = user
        newUserVoted.didVote = true
        if (dontChange) {
          return res.send({
            success: true,
            message: 'Success, vote not recorded'
          })
        } else {
          newUserVoted.save((err, user) => {
          if (err) {
              return res.send({
              success: false,
              message: 'Error: Server error'
              });
          } 
          return res.send({
              success: true,
              message: 'Success, vote recorded'
          });
      
        });
      }
}})
}


exports.create = create;
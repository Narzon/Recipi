const UserVoted = require("../models/UserVoted");

function create(req, res, next) {
  let { user, recipeTitle, dontChange } = req.body;

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
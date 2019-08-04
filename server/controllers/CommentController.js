const Comment = require("../models/CommentModel");
require("dotenv").config();
var jwt = require('jsonwebtoken');

function showAll(req, res, next) {
  if (req.headers) {
    var token = req.headers.token
    var recipe = req.headers.recipe
  } else {
    return res.send({ success: false, message: 'Error: Server error' })
  }
  try {
    let userData = jwt.verify(token, process.env.secretKey)
  } catch (err) {
    return res.send({
      success: false,
      message: "Bad, verification failed"
    })
  }
    Comment.find({ recipe: recipe
        }, (err, result) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }
        res.send(result)
    })
}

function create(req, res, next) {
    let { token, user, recipe, comment } = req.body;
    try {
      let userData = jwt.verify(token, process.env.secretKey)
    } catch (err) {
      return res.send({
        success: false,
        message: "Bad, verification failed"
      })
    }
    if (!comment) {
      return res.send({
        success: false,
        message: 'Error: Comment cannot be blank.'
    });
    }
  
    const newComment = new Comment();
    newComment.recipe = recipe
    newComment.user = user
    newComment.comment = comment
    let today = new Date()
    let date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    newComment.date = date+' at '+time;
    newComment.save((err, comment) => {
    if (err) {
        return res.send({
        success: false,
        message: 'Error: Server error'
        });
    }
    return res.send({
        success: true,
        message: 'Comment posted'
    });
    });
}
exports.showAll = showAll;
exports.create = create;

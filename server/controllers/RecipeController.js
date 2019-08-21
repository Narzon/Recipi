const Recipe = require("../models/RecipeModel");
require("dotenv").config();
var jwt = require('jsonwebtoken');

function show(req, res, next) {
  if (req.headers) {
    var username = req.headers.username
  } else {
    return res.send({ success: false, message: 'Error: Server error' })
  }
    Recipe.find({
        user: username
        }, (err, result) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        } 
        res.send(result)
    });
}
function showOne(req, res, next) {
  let { title } = req.body;
  Recipe.find({
    title: title
  }, (err, result) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    }
    res.send(result)
  })
}
function showAll(req, res, next) {

    Recipe.find({
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
    let { token, user, title, ingredients, description, longDescription, instructions, image, restaurant } = req.body;
    try {
      let userData = jwt.verify(token, process.env.secretKey)
    } catch (err) {
      return res.send({
        success: false,
        message: "Bad, verification failed"
      })
    }
    if (!user) {
      return res.send({
        success: false,
        message: 'Error: User cannot be blank.'
      });
    }
    if (!title) {
      return res.send({
        success: false,
        message: 'Error: Title cannot be blank.'
      });
    }
    if (!ingredients) {
        return res.send({
          success: false,
          message: 'Error: Ingredients cannot be blank.'
        });
    }
    if (!instructions) {
      return res.send({
        success: false,
        message: 'Error: Instructions cannot be blank.'
      });
    }
    if (!longDescription) {
      return res.send({
        success: false,
        message: 'Error: Longer description cannot be blank.'
      });
    }
    if (!restaurant) {
      restaurant = {}
    }
    if (!description) {
      return res.send({
        success: false,
        message: 'Error: Description cannot be blank.'
    });
    }
    title = title.toLowerCase();
    title = title.trim();
  
    Recipe.find({
      "title": title
    }, (err, previousRecipes) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousRecipes.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Recipe already exists.'
        });
      }
  
      const newRecipe = new Recipe();
      newRecipe.title = title
      newRecipe.user = user
      newRecipe.ingredients = ingredients
      newRecipe.description = description
      newRecipe.image = image
      newRecipe.longDescription = longDescription
      newRecipe.instructions = instructions
      newRecipe.rating = 0
      newRecipe.restaurant = restaurant
      newRecipe.save((err, recipe) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Recipe posted'
        });
      });
    });
}
function changeRating(req, res, next) {
  let { title, token } = req.body
  try {
    let userData = jwt.verify(token, process.env.secretKey)
  } catch (err) {
    return res.send({
      success: false,
      message: "Bad, verification failed"
    })
  }
  Recipe.findOneAndUpdate({ title: title }, { $inc: { rating: 1 } }, function(err, result) {
    if (err) {
      res.send({success: false, message: "Server error"});
   } else {
      res.send({ success: true, message: "Rating incremented" });
   }})
}
function changeRatingLess(req, res, next) {
  let { title, token } = req.body
  try {
    let userData = jwt.verify(token, process.env.secretKey)
  } catch (err) {
    return res.send({
      success: false,
      message: "Bad, verification failed"
    })
  }
  Recipe.findOneAndUpdate({ title: title }, { $inc: { rating: -1 } }, function(err, result) {
    if (err) {
      res.send({success: false, message: "Server error"});
   } else {
      res.send({ success: true, message: "Rating incremented down" });
   }})
}
exports.showAll = showAll;
exports.show = show;
exports.create = create;
exports.changeRating = changeRating;
exports.changeRatingLess = changeRatingLess;
exports.showOne = showOne;
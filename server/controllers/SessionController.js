require("dotenv").config();
const UserSession = require('../models/UserSession');
const User = require("../models/UserModel");
var jwt = require('jsonwebtoken');

function signin(req, res, next) {
  const { body } = req;
  const {
    password
  } = body;
  let {
    email
  } = body;
  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }
  email = email.toLowerCase();
  email = email.trim();
  User.find({
    email: email
  }, (err, users) => {
    if (err) {
      console.log('err 2:', err);
      return res.send({
        success: false,
        message: 'Error: server error'
      });
    }
    if (users.length != 1) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    }
    const user = users[0];
    if (!user.validPassword(password)) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    }
    // Otherwise correct user
    const userSession = new UserSession();
    let token = jwt.sign({ userEmail: email, userName: user.username }, process.env.secretKey, { expiresIn: '1h' })
    userSession.userId = user._id;
    userSession.isDeleted = false
    userSession.token = token
    userSession.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      return res.send({
        success: true,
        message: 'Valid sign in',
        token: token
      });
    });
  });
};

function logout(req, res, next) {
  // Get the token
  const token = req.headers.token
  // ?token=test
  // Verify the token is one of a kind and it's not deleted.
  UserSession.findOneAndReplace({
    token: token,
    isDeleted: false
  },
    {
      token: token,
      isDeleted: true
    }
    , null, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
        success: true,
        message: 'Good'
      });
    });
}

function verify(req, res, next) {
  // Get the token
  if (req.headers) {
    var token = req.headers.token
  } else {
    console.log("couldnt find res.headers ??")
    console.dir(req)
    return res.send({ success: false, message: 'Error: Server error' })
  }
  // ?token=test
  // Verify the token is one of a kind and it's not deleted.
  UserSession.find({
    token: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {
      console.log(err);
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (sessions.length != 1) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    } else {
      try {
        let userData = jwt.verify(token, process.env.secretKey)
        return res.send({
          success: true,
          message: 'Good',
          userData: userData
        });
      } catch (err) {
        res.send({
          success: false,
          message: "Bad"
        })
      }
        
    }
  });
}

exports.verify = verify
exports.logout = logout
exports.signin = signin;
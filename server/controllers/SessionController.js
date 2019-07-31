require("dotenv").config();
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
    // Otherwise correct user, provide token with 1 hour expiration
    let token = jwt.sign({ userEmail: email, userName: user.username }, process.env.secretKey, { expiresIn: '1h' })

   return res.send({
     success: true,
     message: "valid sign in",
    token: token
   })
  });
};

//DEFUNCT - now using stateless authentication, server-side logout unnecessary
function logout(req, res, next) {
   return res.send({
     success: false,
     message: "server-side logout defunct"
   })
}

function verify(req, res, next) {
  // Get the token
  if (req.headers) {
    var token = req.headers.token
  } else {
    return res.send({ success: false, message: 'Error: Server error' })
  }
  try {
    let userData = jwt.verify(token, process.env.secretKey)
    return res.send({
      success: true,
      message: "Good, verification success",
      userData: userData
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Bad, verification failed"
    })
  }
}

exports.verify = verify
exports.logout = logout
exports.signin = signin;
const User = require("../models/UserModel");

function create(req, res, next) {
  let { email, password, username } = req.body;

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
  if (!username) {
    return res.send({
      success: false,
      message: 'Error: Username cannot be blank.'
    });
  }
  email = email.toLowerCase();
  email = email.trim();

  //verify email is unique
  User.find( {
    $or: [ { email: email }, { username: username } ] 
  }, (err, previousUsers) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    } else if (previousUsers.length > 0) {
      return res.send({
        success: false,
        message: 'Error: Email or username already exist.'
      });
    }
      const newUser = new User();
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.username = username
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Signed up'
        });
      });
    })

}

exports.create = create;
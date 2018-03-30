const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const passport = require("passport");

const mailer = require('../handlers/mail');
const otp = require('../handlers/otp');

exports.register = async (req, res) => {

  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const existingUser = await User.findOne({'email':req.body.email});

  const errors = req.validationErrors();

  if(existingUser){
    res.status(401);
    res.send({isRegister:false, errorData:["Existing User"]});
  }else{
    if (errors) {
      const errorData = [];
      errors.map(error => errorData.push(error.msg));
      res.send({ isRegister:false, errorData });
    } else {
      const user = new User({email: req.body.email, name: req.body.name, password: req.body.password, interest: req.body.interest});
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, async function(err, hash) {
          user.otp = await otp.generator(6);
          user.otpExpiry = Date.now() + 300000;
          user.isVerified = false;
          user.password = hash;
          mailer.send({email:req.body.email,subject:'OTP GENERTAION',text:`Your otp is ${user.otp}`,html:`<h2>Verification OTP is ${user.otp}</h2>`},res)

          await user.save();
          res.status(201);
          res.json({ isRegister: true, email: req.body.email });

        });
      });
    }
  }
};

exports.login = passport.authenticate("local", {
  successRedirect: "/successjson",
  failureRedirect: "/failurejson",
  failureFlash: false
});

exports.logout = (req, res) => {
  req.logout();
  res.json({ isLogin: false });
};

exports.isLoggedIn = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(201);
    res.json({ isLogin: true });
  } else {
    res.status(401);
    res.json({ isLogin: false });
  }
};

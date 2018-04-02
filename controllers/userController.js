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
    res.json({error:true, message:["Existing User"]});
  }else{
    if (errors) {
      const errorData = [];
      errors.map(error => errorData.push(error.msg));
      res.send({ isRegister:false, message:errorData });
    } else {
      const user = new User({email: req.body.email, name: req.body.name, password: req.body.password, image: req.body.image});
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, async function(err, hash) {
          user.otp = await otp.generator(6);
          user.otpExpiry = Date.now() + 3600000;
          user.isVerified = false;
          user.password = hash;
          mailer.send({email:req.body.email,subject:'OTP GENERTAION',text:`Your otp is ${user.otp}`,html:`<h2>Verification OTP is ${user.otp}</h2>`},res);

          await user.save();
          res.json({ error: false, message: 'User Registered' });

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
  res.json({ isLogin: false });
};

exports.isLoggedIn = async (req, res) => {
  const userData = await User.findOne({email:req.body.email});
  if(userData){
    res.json({ isLogin: true, email: userData.email, name:userData.name, id: userData._id, interest: userData.interest, isVerified: userData.isVerified, image: userData.image });
  }
  else {
    res.json({ isLogin: false });
  }
};

exports.otpVerify = async (req, res) => {
  const user = await User.findOne({ email: req.params.user });
  if(user.otpExpiry.getTime() >= Date.now()){
    console.log(user.otp);
    console.log(req.body.otp);
    if(user.otp === req.body.otp){
      user.isVerified = true;
      await user.save();
      res.json({ error:false, name:user.name, email:user.email, image:user.image, isVerified:user.isVerified });
    }else{
      res.json({error:true,message:['Wrong OTP']});
    }
  }else{
    user.otp = await otp.generator();
    user.otpExpiry = Date.now() + 3600000;
    user.isVerified = false;
    await mailer.send({email:user.email,subject:'OTP GENERTAION',text:`Your otp is ${user.otp}`,html:`<h2>New Verification OTP is ${user.otp}</h2>`},res);

    await user.save();
    res.json({ error: true, message: ['OTP Expired.Please check your mail for new OTP.'] });
  }
}

exports.feedback = async (req,res) => {
  await mailer.send({email:'inovicsapp@gmail.com',subject:'Feedback',text:'Feedback Received',html:`<h4>${req.body.feedback}</h4>`},res);
  res.json({error:false,message:'Feedback has been sent to developers'});
}

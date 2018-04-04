const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const Course = mongoose.model("Course");
const Jobs = mongoose.model("Jobs");
const passport = require("passport");

const mailer = require("../handlers/mail");
const otp = require("../handlers/otp");

exports.register = async (req, res) => {
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.sanitizeBody("email").normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody("password", "Password Cannot be Blank!").notEmpty();
  req
    .checkBody("password-confirm", "Confirmed Password cannot be blank!")
    .notEmpty();
  req
    .checkBody("password-confirm", "Oops! Your passwords do not match")
    .equals(req.body.password);

  const existingUser = await User.findOne({ email: req.body.email });

  const errors = req.validationErrors();

  if (existingUser) {
    res.json({ error: true, message: ["Existing User"] });
  } else {
    if (errors) {
      const errorData = [];
      errors.map(error => errorData.push(error.msg));
      res.send({ isRegister: false, message: errorData });
    } else {
      const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        image: req.body.image
      });
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, async function(err, hash) {
          user.otp = await otp.generator(6);
          user.otpExpiry = Date.now() + 3600000;
          user.isVerified = false;
          user.password = hash;
          mailer.send(
            {
              email: req.body.email,
              subject: "OTP GENERTAION",
              text: `Your otp is ${user.otp}`,
              html: `<h2>Verification OTP is ${user.otp}</h2>`
            },
            res
          );

          await user.save();
          res.json({ error: false, message: "User Registered" });
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
  const userData = await User.findOne({ email: req.body.email });
  if (userData) {
    res.json({
      isLogin: true,
      email: userData.email,
      name: userData.name,
      id: userData._id,
      isVerified: userData.isVerified,
      image: userData.image
    });
  } else {
    res.json({ isLogin: false });
  }
};

exports.otpVerify = async (req, res) => {
  const user = await User.findOne({ email: req.params.user });
  if(user.otpExpiry.getTime() >= Date.now()){
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

exports.saveFavoriteCourses = async (req, res) => {
  const userData = await User.findOne({ email: req.body.email });
  const favorites = userData.favoriteCourses.map(obj => obj.toString());
  const course = await Course.findOne({ _id: req.params.id });
  const operator = favorites.includes(course.id) ? "$pull" : "$addToSet";
  const user = await User.findByIdAndUpdate(
    req.body.user_id,
    {
      [operator]: {
        favoriteCourses: course.id
      }
    },
    { new: true }
  );
  const isFavorite = favorites.includes(course.id)
    ? "Removed from Favorites"
    : "Marked as Favorites";
  res.json({ error: false, message: isFavorite });
};

exports.saveFavoriteJobs = async (req, res) => {
  const userData = await User.findOne({ email: req.body.email });
  const favorites = userData.favoriteJobs.map(obj => obj.toString());
  const job = await Jobs.findOne({ _id: req.params.id });
  const operator = favorites.includes(job.id) ? "$pull" : "$addToSet";
  const user = await User.findByIdAndUpdate(
    req.body.user_id,
    {
      [operator]: {
        favoriteJobs: job.id
      }
    },
    { new: true }
  );
  const isFavorite = favorites.includes(job.id)
    ? "Removed from Favorites"
    : "Marked as Favorites";
  res.json({ error: false, message: isFavorite });
};

exports.showFavoriteJobs = async (req, res) => {
  const userData = await User.findOne({ email: req.params.id });
  const jobs = await Jobs.find({
    _id: { $in: userData.favoriteJobs }
  });
  res.json({ jobs });
};

exports.showFavoriteCourses = async (req, res) => {
  const userData = await User.findOne({ email: req.params.id });
  const courses = await Course.find({
    _id: { $in: userData.favoriteCourses }
  });
  res.json({ courses });
};

exports.feedback = async (req, res) => {
  await mailer.send(
    {
      email: "inovicsapp@gmail.com",
      subject: "Feedback",
      text: "Feedback Received",
      html: `<h4>${req.body.feedback}</h4>`
    },
    res
  );
  res.json({ error: false, message: "Feedback has been sent to developers" });
};

exports.resetPasswordLink = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.json({
      error: true,
      message: ["An account with this email doesn't exist"],
    });
  }
}

exports.saveFavoriteCourses=async(req,res)=>{
  const userData = await User.findOne({email:req.body.email});
  const favorites=userData.favoriteCourses.map(obj=>obj.toString());
  const course=await Course.findOne({_id:req.params.id});
  const operator=favorites.includes(course.id)?'$pull':'$addToSet';
  const user=await User.findByIdAndUpdate(req.body.user_id,{
  [operator]:   { favoriteCourses:course.id
  }} ,
{new:true});
const isFavorite=favorites.includes(course.id)?'Removed from Favorites':'Marked as Favorites';
res.json({error:false,message:isFavorite});
}

exports.saveFavoriteJobs=async(req,res)=>{
  const userData = await User.findOne({email:req.body.email});
  const favorites=userData.favoriteJobs.map(obj=>obj.toString());
  const job=await Jobs.findOne({_id:req.params.id});
  const operator=favorites.includes(job.id)?'$pull':'$addToSet';
  const user=await User.findByIdAndUpdate(req.body.user_id,{
  [operator]:   { favoriteJobs:job.id
  }} ,
{new:true});
const isFavorite=favorites.includes(job.id)?'Removed from Favorites':'Marked as Favorites';
res.json({error:false,message:isFavorite});
}

exports.showFavoriteJobs=async(req,res)=>{
  const userData = await User.findOne({email:req.params.id});
  if(userData){
    const jobs=await Jobs.find({
      _id:{$in: userData.favoriteJobs}
    });
    res.json({jobs});
  }else{
    res.json({error:true,message:['Sorry! Failed to fetch your Favorite Courses.']})
  }
}

exports.showFavoriteCourses=async(req,res)=>{
  const userData = await User.findOne({email:req.params.id});
  if(userData){
    const courses=await Course.find({
      _id:{$in: userData.favoriteCourses}
    });
    res.json({courses});
  }else{
    res.json({error:true,message:['Sorry! Failed to fetch your Favorite Courses']})
  }
}

exports.feedback = async (req,res) => {
  await mailer.send({email:'inovicsapp@gmail.com',subject:'Feedback',text:'Feedback Received',html:`<h4>${req.body.feedback}</h4>`},res);
  res.json({error:false,message:'Feedback has been sent to developers'});
}

exports.updateProfile = async (req,res) => {
  const userData = await User.findOne({ email: req.body.email });

  if(userData){
    userData.name = req.body.name;
    userData.image = req.body.image;
    await userData.save();
    res.json({error:false,message:['Profile Updated Successfully']});
  }else{
    res.json({error:true,message:['You are not authenticated']});
  }

}
exports.resetPasswordLink = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.json({
      error: true,
      message: ["An account with this email doesn't exist"]
    });
  }
resetPasswordLink = `http://localhost:3554/reset/${user._id}`;
user.resetPasswordExpires = Date.now() + 3600000;
await user.save();
await mailer.send(
  {
    email: user.email,
    subject: "Password Reset Link",
    text: `The link to reset your password is ${resetPasswordLink}`,
    html: `<h3>The link to reset your password is <a href=${resetPasswordLink}>here</a></h3>`
  },
  res
);
res.json({
  error:false,
  message:['A reset link has been sent to your email']
});
};

exports.renderResetPassword = async (req, res) => {
const user = User.findOne({
  _id: req.params.id,
  resetPasswordExpires: { $gt: Date.now() }
});
if (!user) {
  res.json({
    error: true,
    message: ["Password link is invalid or has expired"]
  });
}
res.render("reset");
};

exports.updateResetPassword = async (req, res) => {
let message="";
if (req.body.password === req.body["confirm-password"]) {
  const user = await User.findOne({
    _id: req.params.id,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
      message="Password link is invalid or has expired"
      res.render("reset", {message});
  } else {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, async function(err, hash) {
      user.password = hash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      message="Password succesfully changed!"
      res.render("reset", {message});
    });
  });
}
} else {
  const message="Passwords do not match";
  res.render('reset', {message});
}
};

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Please Enter a name"
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: "Please Enter a email"
  },
  password: {
    type: String,
    trim: true,
    required: "Please Enter a password"
  },
  otp: {
    type: String,
    trim: true
  },
  favoriteCourses:[
    {type:mongoose.Schema.ObjectId,ref:'Course'}
  ],
  favoriteJobs:[
    {type:mongoose.Schema.ObjectId,ref:'Jobs'}
  ],
  image:String,
  otpExpiry: Date,
  isVerified: Boolean
});

module.exports = mongoose.model("User", userSchema);

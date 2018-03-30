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
  interest: {
    type: String,
    trim: true
  },
  otp: {
    type: String,
    trim: true
  },
  otpExpiry: Date,
  isVerified: Boolean,
  resetPassword: String,
  resetPasswordExpiry: Date
});

module.exports = mongoose.model("User", userSchema);

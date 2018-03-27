const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jobsSchema = new mongoose.Schema({
  company:{
    type: String,
    trim: true,
    required: 'Please Enter a valid company'
  },
  tags:String,
  salary: {
    type: Number,
    trim: true,
    required: 'Please Enter a Salary'
  },
  title: {
    type: String,
    trim: true,
    required: 'Please Enter a title'
  },
  link: {
    type: String,
    trim: true,
    required: 'Please Enter a link'
  },
  created:{
    type: Date,
    default: Date.now
  }
});

jobsSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  next();
});

module.exports = mongoose.model('Jobs',jobsSchema);

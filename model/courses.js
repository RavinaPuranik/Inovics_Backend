const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const courseSchema = new mongoose.Schema({
  language:{
    type: String,
    trim: true,
    required: 'Please Enter a valid language'
  },
  name: {
    type: String,
    trim: true,
    required: 'Please Enter a name'
  },
  price: {
    type: String,
    trim: true,
    required: 'Please Enter a type'
  },
  author: {
    type: String,
    trim: true,
    required: 'Please Enter a author'
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

courseSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  next();
});

module.exports = mongoose.model('Course',courseSchema);

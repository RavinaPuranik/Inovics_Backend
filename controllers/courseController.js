const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.createCourse = async (req,res) => {
  console.log('Cool', req.body);
  const course = new Course(req.body);
  await course.save();
  console.log("Data Saved");
};

exports.getCourses = async (req,res) => {
  const courses = await Course.find();
  res.json(courses);
}

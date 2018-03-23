const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Jobs = mongoose.model('Jobs');

exports.createCourse = async (req,res) => {
  console.log('Cool', req.body);
  const course = new Course(req.body);
  await course.save();
  console.log("Data Saved");
  res.status(201);
  res.send('It works');
};

exports.getCourses = async (req,res) => {
  const courses = await Course.find();
  res.json(courses);
}

exports.createJob = async (req,res) => {
  console.log('Cool', req.body);
  const jobs = new Jobs(req.body);
  await jobs.save();
  console.log("Data Saved");
  res.status(201);
  res.send('It Shits');
};

exports.getJobs = async (req,res) => {
  const jobs = await Jobs.find();
  res.json(jobs);
}

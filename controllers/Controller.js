const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Jobs = mongoose.model("Jobs");

exports.createCourse = async (req, res) => {
  const names = await Course.find({ name: req.body.name });
  let check = false;
  for (var i = 0; i < names.length; i++) {
    if (names[i].author === req.body.author) {
      check = true;
      break;
    }
  }
  if (!check) {
    const course = new Course(req.body);
    await course.save();
    res.json({ error: false, message: "Course saved successfully!" });
  } else {
    res.json({ error: true, message: "Error while saving the course" });
  }
};

exports.getCourses = async (req, res) => {
  console.log(req.params.name);
  const courses = await Course.find({ language: req.params.name });
  res.json(courses);
};

exports.deleteCourse = async (req, res) => {
  const course = await Course.findOne({ _id: req.body.course_id });
  const language = course.language;
  course.remove();
  const newCourses = await Course.find({ language });
  res.json(newCourses);
};

exports.createJob = async (req, res) => {
  const jobs = new Jobs(req.body);
  await jobs.save();
  res.json({ error: false, message: "Job saved Successfully!" });
};

exports.getJobs = async (req, res) => {
  const jobs = await Jobs.find({ tags: req.params.name });
  res.json(jobs);
};

exports.deleteJob = async (req, res) => {
  const job = await Jobs.findOne({ _id: req.body.job_id });
  const jobType =job.tags;
  job.remove();
const newJobs = await Jobs.find({ tags:jobType });
  res.json(newJobs);
};

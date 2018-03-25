const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Jobs = mongoose.model('Jobs');

exports.createCourse = async (req,res) => {
  console.log('Cool', req.body);
  const names = await Course.find({'name':req.body.name});
  console.log(names);
    let check = false;
    for (var i = 0; i < names.length; i++) {
      if(names[i].author === req.body.author){
        check = true;
        break;
      }
    }
    if(!check){
    const course = new Course(req.body);
    await course.save();
    console.log("Data Saved");
    res.status(201);
    res.json({ok:true});
  }else{
    res.json({error:true});
  }
};

exports.getCourses = async (req,res) => {
  console.log(req.params.name);
  const courses = await Course.find({'language':req.params.name});
  console.log(courses);
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

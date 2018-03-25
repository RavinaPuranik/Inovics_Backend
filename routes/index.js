const express = require('express');
const controller = require('../controllers/Controller');

const router = express.Router();

router.get('/',(req,res) => {
  res.send('Server is Up and Running');
});

// Courses Routes and Controllers handling

router.get('/courses/:name', controller.getCourses);
router.post('/create/courses',controller.createCourse);

// Jobs Routes and Controllers handling

router.get('/jobs', controller.getJobs);
router.post('/create/jobs', controller.createJob);

module.exports = router;

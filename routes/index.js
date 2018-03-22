const express = require('express');
const controller = require('../controllers/courseController');

const router = express.Router();

router.get('/', controller.getCourses);

router.post('/',controller.createCourse);

module.exports = router;

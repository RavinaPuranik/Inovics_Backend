const express = require('express');
const controller = require('../controllers/Controller');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/',(req,res) => {
  res.send('Server is Up and Running');
});

// Courses Routes and Controllers handling

router.get('/courses/:name', controller.getCourses);
router.post('/create/courses',controller.createCourse);
router.post('/delete/courses',controller.deleteCourse);

// Jobs Routes and Controllers handling

router.get('/jobs/:name', controller.getJobs);
router.post('/create/jobs', controller.createJob);
router.post('/delete/jobs',controller.deleteJob);

// User Register and Login handling

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.post('/islogin', userController.isLoggedIn);

router.get('/successjson', function(req, res) {
  res.json({error:false,message:'User is verified'});
});

router.get('/failurejson', function(req, res) {
  res.send({error:true,message:'Please fill the details properly'});
});

// OTP Checking

router.post('/otp/verify/:user', userController.otpVerify);


//Favorites
router.post('/courses/:name/:id',userController.saveFavoriteCourses);
router.post('/jobs/:name/:id',userController.saveFavoriteJobs);
router.get('/favorites/:id',userController.showFavorites);


module.exports = router;

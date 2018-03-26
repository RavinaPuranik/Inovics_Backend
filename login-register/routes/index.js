const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const router = express.Router();
router.get('/',userController.home);
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm );
router.post('/register',userController.upload,
userController.resize,
userController.validateRegister,
userController.register,
authController.login);
router.get('/logout',authController.logout);

module.exports = router;

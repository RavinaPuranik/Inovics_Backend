const mongoose=require('mongoose');
const User=mongoose.model('User');
const promisify = require('es6-promisify');
const jimp=require('jimp');
const uuid=require('uuid');
const multer=require('multer');

const multerOptions={
  storage: multer.memoryStorage(),
  fileFilter(req,file,next){
    const isPhoto=file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null,true);
    }else{
      next('Invalid File Type',false);
    }
  }
};

exports.home=(req,res)=>{
  res.render('home',{title:'Home Page'})
}
exports.loginForm=(req,res)=>{
  res.render('login',{title:'Log In'})
}
exports.registerForm = (req, res) => {
  res.render('register', {title: 'Register'});
};

exports.upload=multer(multerOptions).single('photo');

exports.resize=async(req,res,next)=>{
  if(!req.file){
    next();
    return;
  }
  const extension=req.file.mimetype.split('/')[1];
  req.body.photo=`${uuid.v4()}.${extension}`;
  const photo=await jimp.read(req.file.buffer);
  await photo.resize(800,jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
}

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Please enter a name').notEmpty();
  req.checkBody('email', 'Invalid Email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Please enter a password').notEmpty();
  req.checkBody('password-confirm', 'Confirm your password!').notEmpty();
  req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render('register', { title: 'Register', body: req.body});
    return;
  }
  next();
};

exports.register=async (req,res,next)=>{
  const user=await new User({email:req.body.email,name:req.body.name,photo:req.body.photo});
  const register=await promisify(User.register, User);
  await register(user,req.body.password);
next();
}

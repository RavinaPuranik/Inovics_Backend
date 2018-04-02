const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

require('./handlers/passport');

const routes = require('./routes/index');

const app = express();

app.use(express.static(path.join(__dirname,'public')));

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}));

app.use(expressValidator());

app.use(passport.initialize());
app.use(passport.session());

app.use('/',routes);

module.exports = app ;

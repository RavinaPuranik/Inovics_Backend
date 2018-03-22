const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes/index');

const app = express();

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',routes);

module.exports = app ;

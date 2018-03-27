const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors=require('cors');
const routes = require('./routes/index');

const app = express();

app.use(express.static(path.join(__dirname,'public')));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',routes);

module.exports = app ;

const mongoose = require('mongoose');

require('dotenv').config({ path : 'variables.env' });

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

mongoose.connection.on('error', (err) => {
  console.error('Something went wrong with Database connection, please check start.js ');
});

mongoose.connection.once("open", () => {
  console.log("Connection Established");
});

require('./model/courses');
require('./model/jobs');
require('./model/user');

const app = require('./index');

app.set('port',process.env.PORT || 3000);

const server = app.listen(app.get('port'),() => {
  console.log('Hola! Server is rolling at '+server.address().port);
})

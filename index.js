'use strict';
require('dotenv').config();
// Start up DB Server
const { db } = require('./src/auth/models/index.js');

db.sync()
  .then(() => {

    // Start the web server
    require('./src/server.js').startup(process.env.PORT);
  }).catch((err) => {
    console.log(err.message);
  });
 
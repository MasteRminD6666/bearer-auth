
'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');


module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  
  
  console.log('-----------------------------------------------',basic);
  let [username, password] = base64.decode(basic).split(':');
  console.log('user name and passs decoeded ',username, password);

  try {
    // console.log(username,pass);
    req.user = await users.authenticateBasic(username, password)
    console.log( 'getting back to this', req.user);
    //TODO REAChed here but dos not send it to the route
    next(); 
  } catch (e) {
    res.status(403).send('Invalid Login here');
  }

}
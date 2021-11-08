
'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');


module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  
  console.log('-----------------------------------------------',basic);
  let [username, pass] = base64.decode(basic).split(':');
  console.log(username, pass);

  try {
    // console.log(username,pass);
    req.user = await users.authenticateBasic(username, pass)
    next(); 
  } catch (e) {
    res.status(403).send('Invalid Login here');
  }

}
'use strict';

const  { user }  = require('../models/index.js');

module.exports = async (req, res, next) => {

  try {
    console.log(req.headers.authorization.split(' ').pop());
    if (!req.headers.authorization) { next('Invalid Login') }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await user.authenticateToken(token);

    req.user = validUser;
    req.token = validUser.token;
    next()
  } catch (e) {
    res.status(403).send('Invalid Login');;
  }
}
'use strict';
require('dotenv').config();
const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { users } = require('./models/index.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')

authRouter.post('/signup', async (req, res, next) => {

    
  try {
    let userRecord = await users.create(req.body);

    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(200).json(output);
  } catch (e) {
    
    next(e.message);
  }
 
   
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  try {
    const user = {
        user: request.user,
        token: request.user.token
      };
      res.status(200).json(user);
  }catch(e){
    next(e.message);
  }

});
//next removed 
authRouter.get('/users', bearerAuth, async (req, res) => {
  const allUseres = await users.findAll({});
  const list = allUseres.map(user => user.username);
  res.status(200).json(list);
});
//next removed
authRouter.get('/secret', bearerAuth, async (req, res) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;
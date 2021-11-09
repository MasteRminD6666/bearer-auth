'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_key =`${process.env.SECRET}`|| "toes";
console.log(jwt_key);
const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username },jwt_key);
      }
    }
  });

  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
   console.log(user.password);
  });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where:{username} })
    // console.log('HEREEE user info',user);
    console.log('HEREEE user password',user.password);
    const valid = await bcrypt.compare(password, user.password)
    console.log('HEREEE user is valid',valid);
    // console.log('after finding the user ----------------------------------', user);
    if (valid) { 
      console.log('going inside if ===========================');
      //TODO check this method 
      //TODO  here the error
      // let newToken = jwt.sign({ username: user.username ,jwt_key})
      // user.token = newToken
      return user; }
    throw new Error('Invalid User here');
  }

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token,jwt_key);
      const user = await this.findOne({ where:{ username: parsedToken.username }})

      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error('catch this', e.message)
    }
  }

  return model;
}

module.exports = userSchema;
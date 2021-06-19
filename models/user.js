const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String
    },
    isVerified:{
      type:Boolean,
      default:false
    }
  });


  userSchema.virtual('check',{
      ref:'check',
      localField:'_id',
      foreignField:'UserId'
  })

  userSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id}, process.env.jwtPrivateKey);
    return token;
  }
  
  const User = mongoose.model('user', userSchema);
  
  function validateUser(user) {
    const schema = 
    Joi.object({ 
        name: Joi.string().min(5).max(50),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required() 
    });
    return schema.validate(user);
  }
  
  exports.User = User; 
  exports.validate = validateUser;
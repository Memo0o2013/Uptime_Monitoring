const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required : [true,'Name must be Unique'],
        unique : true
    },
    url:{
        type: String,
    },
    tag:{
        type: String
    },
    ignoreSSL:{
        type: Boolean
    },
    port:{
        type:Number
    },
    protocol:{
        type:String
    },
    webhook:{
        type:String
    },
    interval:{
        type:Number
    },
    config:{
        intervalUnits:{
            type:String
        }
    },
    checkStatus:{
        type:String
    },
    firstCheck:{
        type:Boolean,
        default: false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
  });

  
  
  const Check = mongoose.model('check', userSchema);
  
  function validateCheck(check) {
    const schema = 
    Joi.object({ 
        name: Joi.string().min(5).max(50),
        url: Joi.string().min(5).required(),
        userId: Joi.string(),
        interval:Joi.number().optional(),
        port:Joi.number().optional(),
        ignoreSSL:Joi.bool().optional(),
        config:Joi.object().optional(),
        webhook:Joi.string().optional(),
        protocol:Joi.string().optional(),
        checkStatus:Joi.string().optional(),
        tag:Joi.string().optional(),
        firstCheck:Joi.string().optional()
    });
    return schema.validate(check);
  }
  
  exports.Check = Check; 
  exports.validate = validateCheck;
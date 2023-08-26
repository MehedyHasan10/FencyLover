const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require('../secret');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    maxlength: [31, 'User name can be maximum 31 characters'],
    minlength: [5, 'User name must be at least 5 characters long']
  },


  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Email is required'],
    unique: [true, 'This email is already in use'],
    validate: {
      validator: function (v){
        return /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be 8 characters'],
    set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)) // how many round I salting use bcrypt.genSaltSync(10)
  },


  image: {
    type: Buffer,
    containType: String,
    //default: defaultImagePath , 
    required: [true, 'User image is required'],
         
  },



  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [3, 'Address must be at least 3 characters long']
  },



  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },


  isAdmin: {
    type: Boolean,
    default: false
  },


  isBanned: {
    type: Boolean,
    default: false
  }
},

{ timestamps: true });

const User = model('Users', userSchema);
module.exports = User;

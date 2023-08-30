const {body} = require('express-validator');

//for single input
const validatorUserRegistration=[
body('name')
.trim()
.notEmpty()
.withMessage('Name is required')
.isLength({min:5,max:31})
.withMessage('name should be at least 5 to 31 characters long'),

body('email')
.trim()
.notEmpty()
.withMessage('Email is required')
.isEmail()
.withMessage('Invalid Email Address'),

body('password')
.trim()
.notEmpty()
.withMessage('Password is required')
.isLength({min:8})
.withMessage('Password must be 8 characters')
.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
.withMessage('At least one uppercase. At least one lower case. At least one special character'),

body('address')
.trim()
.notEmpty()
.withMessage('Address is required')
.isLength({min:3,max:31})
.withMessage('Address must be 3 charcters'),

body('phone')
.trim()
.notEmpty()
.withMessage('Phone Number is required'),

body('image')
.custom((value, { req }) => {
    if (!req.file || !req.file.buffer) {
      throw new Error('User image is required');
    }
    return true;
  })
.withMessage('User image is required'),




];


const validatorUserLogin=[
  
  body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid Email Address'),
  
  body('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required')
  .isLength({min:8})
  .withMessage('Password must be 8 characters')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
  .withMessage('At least one uppercase. At least one lower case. At least one special character'),
   
];


const validatorUserPasswordUpdate=[
  
    body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('Old password is required')
    .isLength({min:8})
    .withMessage('Password must be 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage('At least one uppercase. At least one lower case. At least one special character'),
     
    body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({min:8})
    .withMessage('Password must be 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage('At least one uppercase. At least one lower case. At least one special character'),
     
    body('confirmedPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirmed password is required') 
    .custom((value,{req})=>{
      if(value !== req.body.newPassword){
        throw new Error('Password did not match');
      }
      return true;
    })
   
];


const validatorUserForgetPasswordUpdate=[
  
  body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid Email Address'),
   
];


const validatorUserResetPasswordUpdate=[
  body('token')
  .trim()
  .notEmpty()
  .withMessage('Token is required'),
  
  
  body('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required')
  .isLength({min:8})
  .withMessage('Password must be 8 characters')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
  .withMessage('At least one uppercase. At least one lower case. At least one special character'),
   
];


 




module.exports={
              validatorUserRegistration,
              validatorUserLogin,
              validatorUserPasswordUpdate,
              validatorUserForgetPasswordUpdate,
              validatorUserResetPasswordUpdate,
              };

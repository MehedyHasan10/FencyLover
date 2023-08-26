const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse, errorResponse } = require('./responseController');
const mongoose= require('mongoose');
const {findWithId} = require('../helper/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { createJsonWebToken } = require('../helper/jsonWebToken');
const { jwtActivationKey, clientURL, jwtRestPasswordKey } = require('../secret');
const { token } = require('morgan');
const emailwithNodeMailer = require('../helper/email');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { runValidation } = require('../validator');




const getUsers = async (req,res,next) =>{


    try{
         
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1; //pagination
    const limit = Number(req.query.limit) || 5; //pagenation

    // using i for case in sencetive
    const searchRegExp = new RegExp('.*'+ search + '.*','i') ;// example my name is siam hasan mehedy admin search hasan in database find all hasan 
    
    const filter = {
        isAdmin: {$ne: true},
        $or:[
            {name:{$regex:searchRegExp}},
            {email:{$regex:searchRegExp}},
            {phone:{$regex:searchRegExp}},        
        ],
    };


    const options = {
        password:0
    };


    const users = await User.find(filter,options) //find all users                                                          
    .limit(limit)
    .skip((page-1) * limit);
    const count = await User.find(filter).countDocuments();

    
    if (users.length === 0) {
      throw createError(404, 'Users Not found');
    }



   
    return successResponse(res,{
        statusCode:200,
        message:'Users Returnd...........',
        payload:{
            users,
            pagination: {
                 totalPages: Math.ceil(count / limit),
                 currentPage:page,
                 previousPage: page - 1> 0 ? page-1 : null,
                 nextPAge: page + 1 <= Math.ceil(count / limit) ? page + 1 : null ,
            },
        },
       
    });

} catch (error){
    next(error);
}
};


const getUserById = async (req,res,next) =>{


        try{
            const id = req.params.id;
            const options = {password: 0}
          
            const user =await findWithId(User,id,options);  // it comes here in ./secvices/findItem

            return successResponse (res,{
                statusCode: 200,
                message:'user return sucessfully',
                payload: {user},
            });
                  
    } catch (error){
        next(error);
    }
};


const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        await findWithId(User,id, options); // Assuming findWithId is a valid function

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });
        return successResponse (res,{
            statusCode: 200,
            message:'user delete sucessfully',
         
        });
              
} catch (error){
    next(error);
}
};


const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const image = req.file;
   
    if(!image){
      throw new Error('Image file is required');
    }
    if(image.size > 1024*1024*5){
      throw new Error('File is too large,It must be less than 5 mb');
    }

    
 
    const imageBufferString = image.buffer.toString('base64');  //algorithm

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw new Error('User with this email already exists, please sign in');
    }
     //create jwt
    const token = createJsonWebToken(
      '15m', // expiresIn
      {
        name,
        email,
        password,
        phone,
        address,
        image:imageBufferString
      },
      jwtActivationKey
    );

    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
        <h2>Hello ${name}</h2>
        <p>Please click here to
         <a href="${clientURL}/api/users/activate/${token}" target="_blank">
        activate your account</a> 
        </p>  `
    };

    try {
      await emailwithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, 'Failed to send verification email'));
      return;
    }

    // Fetch data from the token
    const decodedToken = jwt.verify(token, jwtActivationKey);
    // Store the user in the database
    const newUser = new User({
      name,
      email,
      password,
      phone,
      address,
      image:imageBufferString
    });
    const savedUser = await newUser.save();

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to complete your registration`,
   
    });
  } catch (error) {
    next(error);
  }
};


const activateAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, 'Token not found');

    const decoded = jwt.verify(token,jwtActivationKey); 

    await User.create(decoded);

    return successResponse(res, {
      statusCode: 201,
      message: "User was registered successfully",
    });
  } catch (error) {
    next(error);
  }
};


const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);
    const UpdateOptions = { new: true, runValidation: true, context: 'query' };
    let updates = {};

    for (let key in req.body) {
      if (['name', 'password', 'address', 'phone'].includes(key)) {
        updates[key] = req.body[key];
      } else if(['email'].includes(key)){
        throw createError(400,'email can not be update');
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 5) {
        throw new Error('File is too large, it must be less than 5 MB');
      }
      updates.image = image.buffer.toString('base64');
    }

    const updateUser = await User.findByIdAndUpdate(userId, updates, UpdateOptions)
    .select("-password");   // .select("-password") use for deselected
    if (!updateUser) {
      throw new Error('User with this ID does not exist');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'User updated successfully',
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};


const userBanById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = {isBanned: true};
    const UpdateOptions = { new: true, runValidation: true, context: 'query' };
   

    const updateUser = await User.findByIdAndUpdate(userId,updates, UpdateOptions).select("-password");   // .select("-password") use for deselected
    if (!updateUser) {
      throw new Error('User is not banned successfuly');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'User is banned successfuly',
    
    });
  } catch (error) {
    next(error);
  }
};


const userUnanById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = {isBanned: false};
    const UpdateOptions = { new: true, runValidation: true, context: 'query' };
   

    const updateUser = await User.findByIdAndUpdate(userId,updates, UpdateOptions).select("-password");   // .select("-password") use for deselected
    if (!updateUser) {
      throw new Error('User is not unbanned successfuly');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'User is unbanned successfuly',
    
    });
  } catch (error) {
    next(error);
  }
};



const updatePassword  = async (req, res, next) => {
  try {

    const {oldPassword,newPassword} = req.body;
    const userId = req.params.id;
    const user = await findWithId(User,userId);

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        throw createError(400, 'Old Password did not match');
      }
   
    const updateUser = await User.findByIdAndUpdate(
      userId,
     { password: newPassword },
     { new: true }

      ).select("-password");  

    if (!updateUser) {
      throw new Error('Password did not update');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Update password successfuly',
      payload: {updateUser}
    
    });
  } catch (error) {
    next(error);
  }
};


const forgetPassword  = async (req, res, next) => {
  try {

    const {email} = req.body;
    const user = await User.findOne({email:email});
    
    if(!user){
      throw createError(404,'Email is incorrect');

    }

    const token = createJsonWebToken(
      '15m', // expiresIn
      { email },
      jwtRestPasswordKey
    );

    const emailData = {
      email,
      subject: 'Reset Password Email',
      html: `
        <h2>Hello ${user.name}</h2>
        <p>Please click here to
         <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">
        reset your password</a> 
        </p>  `
    };

    try {
      await emailwithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, 'Failed to send reset password email'));
      return;
    }


    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to reset password`,
      payload: { token },
    });
    
    
  } catch (error) {
    next(error);
  }
};



const resetPassword  = async (req, res, next) => {
  try {

    const {token,password} = req.body;
    const decoded = jwt.verify(token,jwtRestPasswordKey);
    if(!decoded){
      throw createError(400,'Invalid token')
    }
    

    const updateUser = await User.findOneAndUpdate(
     { email: decoded.email}, //decoded the email address from forgetPassword 
     { password:password },   //update password the password comes from req.body (password)
     { new: true }

      ).select("-password");  

    if (!updateUser) {
      throw new Error('Password did not reset');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Reset password successfuly',
    
    });
  } catch (error) {
    next(error);
  }
};

  

 
module.exports = {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateAccount,
    updateUserById,
    userBanById,
    userUnanById,
    updatePassword,
    forgetPassword,
    resetPassword
};


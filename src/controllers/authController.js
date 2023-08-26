const createError = require('http-errors');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createJsonWebToken } = require('../helper/jsonWebToken');
const { jwtActivationKey, clientURL, jwtAccessKey, jwtRefreshKey } = require('../secret');
const { successResponse, errorResponse } = require('./responseController');


const handleLogin = async (req, res, next) => {
    try {
      // Pick email & password from body
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        throw createError(404, 'User does not exist with this email. Please register first');
      }
  
      // Compare the password with the database (use hash to encrypt)
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw createError(401, 'Email or password did not match');
      }
  
      // Check if the user is banned
      if(user.isBanned){
        throw createError(403, 'You are banned.Please Contact authority');
      }
      // Generate token (set this token in cookies)->http only cookie some one hack brower he does not access and http cookie set in req.body
      const accessToken = createJsonWebToken(
        '15m', // expiresIn
       { _id:user._id },  
       jwtAccessKey

      );
      
      res.cookie('access_token',accessToken,{
        maxAge: 15* 60 * 1000, //15 min
        httpOnly: true,
        //secure: true,
        sameSite: 'none' // cross sit req means req 3001 to 3002
      })

      const refreshToken = createJsonWebToken(
        '7d', // expiresIn
       { _id:user._id },  
       jwtRefreshKey

      );
      
      res.cookie('refresh_token',refreshToken,{
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 day
        httpOnly: true,
        //secure: true,
        sameSite: 'none' // cross sit req means req 3001 to 3002
      })
      // user.toObject();
      // delete userWithoutPassword.password; 

      //await User.findOne({ email }).select("-password");
      const userWithoutPassword = await User.findOne({ email }).select("-password");
      // Send success response
      return successResponse(res, {
        statusCode: 200,
        message: 'User logged in successfully',
        payload: {userWithoutPassword},
      });
    } catch (error) {
      next(error);
    }
};
  

const handleLogout = async (req, res, next) => {
    try {
      //clear cookie
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
      // Send success response
      return successResponse(res, {
        statusCode: 200,
        message: 'User logged out successfully',
        payload: {},
      });
    } catch (error) {
      next(error);
    }
};


const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken=req.cookies.refresh_token;
    //verify refresh old refresh token
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
    if(!decodedToken){
      throw createError(401,'Invalid refresh token');
    }
    
    const accessToken = createJsonWebToken(
      '5m', // expiresIn
      { decodedToken:User._id },  
     jwtAccessKey

    );
    
    res.cookie('access_token',accessToken,{
      maxAge: 5* 60 * 1000, //15 min
      httpOnly: true,
      //secure: true,
      sameSite: 'none' // cross sit req means req 3001 to 3002
    })

   
    return successResponse(res, {
      statusCode: 200,
      message: 'new access token is generated',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
 

const handleProtected = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if(!token){
        throw createError (401,'Access token not found');
    }

    const decoded=jwt.verify(token,jwtAccessKey);
    if(!decoded){
        throw createError (401,'Invalid access token.');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Protected Successfully',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};



  module.exports = {
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handleProtected
  };
  
  
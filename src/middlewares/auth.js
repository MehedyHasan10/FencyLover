const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { jwtAccessKey } = require('../secret');
const User = require('../models/userModel');
const { findWithId } = require('../helper/findItem');

const isLoggedIn = async (req,res,next)=>{
    try {

        const token = req.cookies.access_token;
        if(!token){
            throw createError (401,'Access token not found');
        }

        const decoded=jwt.verify(token,jwtAccessKey);
        if(!decoded){
            throw createError (401,'Invalid access token.Please login again');
        }
         req.body.id = decoded._id;
       next()
        
    } catch (error) {
        return next(error)
    }
};


const isLoggedOut = async (req, res, next) => {
    try {
      const token = req.cookies.access_token;
      
      if (token) {
        throw createError(400, 'User is already logged in');
      }
  
      next();
    } catch (error) {
      next(error);
    }
};



const isAdmin = async (req, res, next) => {
  try {

    const token = req.cookies.access_token;
    if(!token){
        throw createError (401,'Access token not found');
    }

    const decoded=jwt.verify(token,jwtAccessKey);
    if(!decoded){
        throw createError (401,'Invalid access token.Please login again');
    }
 
    const user = await findWithId(User,decoded._id)
    if ( !user.isAdmin) {
      throw createError(403, 'User is not an admin');
    }
    
    
     next();
    
    

    
  } catch (error) {
    next(error);
  }
};



module.exports={
    isLoggedIn,
    isLoggedOut,
    isAdmin
 
}

const express = require('express');
const { 
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
       } = require('../controllers/userController');

const {
      validatorUserRegistration,
      validatorUserPasswordUpdate,
      validatorUserForgetPasswordUpdate, 
      validatorUserResetPasswordUpdate
      } = require('../validator/auth');

const { 
      isLoggedIn, 
      isLoggedOut, 
      isAdmin
      } = require('../middlewares/auth');

const { runValidation } = require('../validator');
const upload = require('../helper/uploadFile');
const userRouter = express.Router();

userRouter.post('/process-register',
                  upload.single("image"),
                  isLoggedOut,
                  validatorUserRegistration,
                  runValidation,  
                  processRegister);


userRouter.put('/reset-password',
                  validatorUserResetPasswordUpdate,
                  runValidation,
                  resetPassword );

userRouter.put('/:id([a-fA-F0-9]{24})',
                  upload.single("image"),
                  isLoggedIn,
                  updateUserById );

userRouter.post('/verify',
                  isLoggedOut,
                  activateAccount);

userRouter.get('/',
                  isLoggedIn,
                  isAdmin,
                  getUsers);

userRouter.get('/:id([a-fA-F0-9]{24})',
                  isLoggedIn, 
                  getUserById);

userRouter.delete('/:id([a-fA-F0-9]{24})',
                  isLoggedIn,
                  deleteUserById);

userRouter.put('/ban-user/:id([a-fA-F0-9]{24})',
                  isLoggedIn,
                  isAdmin,
                  userBanById );

userRouter.put('/unban-user/:id([a-fA-F0-9]{24})',
                  isLoggedIn,
                  isAdmin,
                  userUnanById );       

userRouter.put('/update-password/:id',
                  validatorUserPasswordUpdate,
                  runValidation,
                  isLoggedIn,
                  updatePassword );

userRouter.post('/forget-password',
                  validatorUserForgetPasswordUpdate,
                  runValidation,
                  forgetPassword );



module.exports = userRouter;

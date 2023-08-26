const express = require('express');
const { runValidation } = require('../validator');
const { handleLogin, handleLogout,handleRefreshToken, handleProtected } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');
const { validatorUserLogin} = require('../validator/auth');


const authRouter = express.Router();


authRouter.post('/login',
                validatorUserLogin,
                runValidation,
                isLoggedOut,
                handleLogin);


authRouter.post('/logout',
                isLoggedIn,
                handleLogout);

authRouter.get('/refresh-token',
               handleRefreshToken);

authRouter.get('/protected',
                handleProtected);

module.exports = authRouter;

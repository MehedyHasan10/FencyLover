const express = require('express');
const { seedUser, seedProduct } = require('../controllers/seedController');
const seedRouter = express.Router();

seedRouter.get('/users', seedUser);
seedRouter.get('/products',seedProduct);

module.exports=seedRouter;
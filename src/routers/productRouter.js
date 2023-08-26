
const express = require('express');

const { 
      isLoggedIn, 
      isLoggedOut, 
      isAdmin
      } = require('../middlewares/auth');

const { runValidation } = require('../validator');
const upload = require('../helper/uploadFile');
const { createProduct, 
        getAllProduct, 
        getSingleProduct,
        deleteProduct, 
        updateProduct} = require('../controllers/productController');


const { validatorProduct } = require('../validator/product');
const productRouter = express.Router();

productRouter.post('/',
                  upload.single("image"),
                  validatorProduct,
                  runValidation,
                  isLoggedIn,
                  isAdmin,
                  createProduct);



productRouter.get('/',
                  getAllProduct);

productRouter.get('/:slug',
                  getSingleProduct);

productRouter.delete('/:slug',
                     isLoggedIn,
                     isAdmin,
                     deleteProduct);

productRouter.put('/:slug',
                   upload.single("image"),
                   isLoggedIn,
                   isAdmin,
                   updateProduct);








module.exports = productRouter;

const {body} = require('express-validator');

//for single input
const validatorProduct=[
body('name')
.trim()
.notEmpty()
.withMessage('Product name is required')
.isLength({min:3})
.withMessage('Catagory name should be at least 3 charcters long'),



body('description')
.trim()
.notEmpty()
.withMessage('Description name is required')
.isLength({min:3})
.withMessage('Description should be at least 3 charcters long'),

body('price')
.trim()
.notEmpty()
.withMessage('Price is required')
.isFloat({min:0})
.withMessage('Price must be positive number'),

body('quantity')
.trim()
.notEmpty()
.withMessage('Quantity is required')
.isInt({min:1})
.withMessage('Quantity must be positive number'),


body('category')
.trim()
.notEmpty()
.withMessage('Category is required'),

body('size')
.trim()
.notEmpty()
.withMessage('Size is required'),

body('image')
.custom((value, { req }) => {
    if (!req.file || !req.file.buffer) {
      throw new Error('User image is required');
    }
    return true;
  })
.withMessage('Product image is required'),





];


module.exports={
               validatorProduct,
            
              };
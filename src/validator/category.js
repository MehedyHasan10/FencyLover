const {body} = require('express-validator');

//for single input
const validatorCategory=[
body('name')
.trim()
.notEmpty()
.withMessage('Catagory name is required')
.isLength({min:3})
.withMessage('Catagory name should be at least 3 charcters long'),

];


module.exports={
               validatorCategory,
            
              };

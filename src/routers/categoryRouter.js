
const express = require('express');

const { 
      isLoggedIn, 
      isLoggedOut, 
      isAdmin
      } = require('../middlewares/auth');

const { runValidation } = require('../validator');
const upload = require('../helper/uploadFile');
const { createCategory,
        getAllCategories,
        getSingleCategory, 
        updateCategory, 
        deleteCategory} = require('../controllers/categoryController');

const { validatorCategory } = require('../validator/category');

const categoryRouter = express.Router();

categoryRouter.post('/',
                    validatorCategory,
                    runValidation,
                    isAdmin,
                    isLoggedIn,
                    createCategory                   
);

categoryRouter.get('/',
                  getAllCategories
);

categoryRouter.get('/:slug',
                  getSingleCategory
);

categoryRouter.put('/:slug',
                    validatorCategory,
                    runValidation,
                    isAdmin,
                    isLoggedIn,
                    updateCategory
);

categoryRouter.delete('/:slug',
                    isAdmin,
                    isLoggedIn,
                    deleteCategory
);




module.exports = categoryRouter;

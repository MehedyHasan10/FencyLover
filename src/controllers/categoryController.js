const slugify = require('slugify')
const createError = require('http-errors');
const { successResponse, errorResponse } = require('./responseController');
const Category = require('../models/categoryModel');
const { categoryCreate, getCategories, getCategory, categoryUpdate, categoryDelete } = require('../helper/categoryService');

const createCategory = async (req, res, next) => {
    try {
      const { name } = req.body;
    

      const newCategory = await categoryCreate(name);
  
      return successResponse(res, {
        statusCode: 201,
        message: 'Category is created successfully',
        payload: newCategory
     
      });
    } catch (error) {
      next(error);
    }
};


const getAllCategories = async (req, res, next) => {
    try {
    
      const categories = await getCategories();
  
      return successResponse(res, {
        statusCode: 200,
        message: 'Categories was returned successfully',
        payload: categories
     
      });
    } catch (error) {
      next(error);
    }
};


const getSingleCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await getCategory(slug);

    if(!category){
      throw createError(404,'Category not found');
    }


    return successResponse(res, {
      statusCode: 200,
      message: 'Category was returned successfully',
      payload: category
   
    });
  } catch (error) {
    next(error);
  }
};


const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
  

    const category = await categoryUpdate(name,slug)

    if(!category){
      throw createError(404,'Category not found');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Category is updated successfully',
      payload: category
   
    });
  } catch (error) {
    next(error);
  }
};


const deleteCategory = async (req, res, next) => {
  try {
   
    const { slug } = req.params;
  

    const category = await categoryDelete(slug);

    if(!category){
      throw createError(404,'Category not found');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Category is deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
 
  
module.exports = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
};
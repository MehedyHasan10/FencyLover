const createError = require('http-errors');
const { successResponse, errorResponse } = require('./responseController');
const mongoose= require('mongoose');
const {findWithId} = require('../helper/findItem');
const { deleteImage } = require('../helper/deleteImage');
const fs = require('fs').promises;
const { runValidation } = require('../validator');
const Product = require('../models/productModel');
const { default: slugify } = require('slugify');
// const { productCreate, getProduct } = require('../helper/productService');
const Category = require('../models/categoryModel');





//name,slug,description,price,quantity,size,image,sold,shipping

const createProduct = async (req, res, next) => {
  try {
    const { name,description,price,quantity,size,shipping,category } = req.body;

    const image = req.file;
   
    if(!image){
      throw new Error('Image file is required');
    }
    if(image.size > 1024*1024*5){
      throw new Error('File is too large,It must be less than 5 mb');
    }

    
 
    const imageBufferString = image.buffer.toString('base64');  //algorithm
 

                const productExists = await Product.exists({ name: name });
                if (productExists) {
                  throw createError(409,'Product with this name already exits');
                }
                 //create Product
                const product= await Product.create(
                  {
                    name: name,
                    slug: slugify(name),
                    description: description,
                    price: price,
                    quantity: quantity,
                    size: size,
                    shipping: shipping,
                    category: category,  
                    image:imageBufferString
                  });

    return successResponse(res, {
      statusCode: 200,
      message: 'Product was created sucessfully',
      payload: product,
   
    });
  } catch (error) {
    next(error);
  }
};



const getAllProduct = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;


    const searchRegExp = new RegExp('.*'+ search + '.*','i') ;// example my name is siam hasan mehedy admin search hasan in database find all hasan 
    
    const filter = {
  
        $or:[
            { name:{$regex:searchRegExp} },
      
        ],
    };

    const products = await Product.find(filter)
      .populate('category') 
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

      const count = await Product.find(filter).countDocuments(); 

    if (products.length === 0) {
      throw createError(404, 'Product Not found');
    }

  

    return successResponse(res, {
      statusCode: 200,
      message: 'Product was returned sucessfully......',
      payload: {
        products: products,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage:page,
          previousPage: page - 1,
          nextPAge: page + 1  ,
          totalNumberOfProducts: count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


const getSingleProduct = async (req, res, next) => {
  try {

    const {slug} = req.params;
    const product = await Product.findOne({slug}).populate('category');

    if (!product) {
      throw createError(404, 'Product Not found');
    } 
   

    return successResponse(res, {
      statusCode: 200,
      message: 'Return product..',
      payload: {product},
    
    });
  } catch (error) {
    next(error);
  }
};


const deleteProduct = async (req, res, next) => {
  try {

    const {slug} = req.params;
    const product = await Product.findOneAndDelete({slug});

    if (!product) {
      throw createError(404, 'Product Not found');
    } 
   

    return successResponse(res, {
      statusCode: 200,
      message: 'This product delete sucessfully..',
    
    
    });
  } catch (error) {
    next(error);
  }
};



const updateProduct = async (req, res, next) => {
  try {
    const {slug} = req.params;
   
    const UpdateOptions = { new: true, runValidation: true, context: 'query' };
    let updates = {};

    for (let key in req.body) {
      if (['name','description','price','quantity','size','sold','shipping'].includes(key)) {
        updates[key] = req.body[key];
      } 
    }
    if(updates.name){
      updates.slug= slugify(updates.name);
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 5) {
        throw new Error('File is too large, it must be less than 5 MB');
      }
      updates.image = image.buffer.toString('base64');
    }

    const updateProduct = await Product.findOneAndUpdate({slug}, updates, UpdateOptions)
    
    if (!updateProduct) {
      throw new Error('Product with this ID does not exist');
    }
  
   

    return successResponse(res, {
      statusCode: 200,
      message: 'This product updated sucessfully..',
      payload: updateProduct,
    
    
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
                createProduct,
                getAllProduct,
                getSingleProduct,
                deleteProduct,
                updateProduct
};


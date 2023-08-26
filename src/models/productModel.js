const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require('../secret');
const Category = require('./categoryModel');


//name,slug,description,price,quantity,size,image,sold,shipping

const productSchema = new Schema({
name: {
    type: String,
    required: [true, 'product name is required'],
    trim: true,
    maxlength: [31, 'product name can be maximum 31 characters'],
    minlength: [3, 'product name must be at least 5 characters long']
  },

slug:{
    type: String,
    required: [true, 'Product slug name is required'],
    lowercase:true,
    unique:true,
  },


description: {
    type: String,
    trim: true,
    minlength: [3, 'product name must be at least 5 characters'],
   
    
  },
price: {
    type: Number,
    required: [true, 'Price is required'],
    trim: true,
    validate:{
        validator: (v)=> v > 0,
        message: (props)=>`${props.value} is not a valid price`,
    },    
  },

quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    trim: true,
    validate:{
        validator: (v)=> v > 0,
        message: (props)=>`${props.value} is not a valid quantity`,
    },   
  },

size:{
    type:String,
    required: [true, 'size is required'],
    trim: true,
},

sold:{
    type: Number,
    // required: [true, 'Sold is required'],
    // trim: true,
    default:0,
    // validate:{
    //     validator: (v)=> v > 0,
    //     message: (props)=>`${props.value} is not a sold quantity`,
    // },   

},

shipping:{
    type: Number,
    default:0

},

image: {
    type: Buffer,
    containType: String,
    //default: defaultImagePath , 
    required: [true, 'User image is required'],
         
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },



},

{ timestamps: true });

const Product= model('Product', productSchema);
module.exports = Product;

const slugify = require('slugify')
const Category = require('../models/categoryModel');

const categoryCreate = async (name) => {
    
      const newCategory = await Category.create({
        name: name,
        slug: slugify(name),
      });
      return newCategory;
};

const getCategories= async () => {
    
    return await Category.find({}).select('name slug').lean();
}; 

const getCategory = async (slug) => {

      return await Category.findOne({ slug }).select('name slug').lean();
    
};

const categoryUpdate = async (name,slug) => {

   const categoryUpdate = await Category.findOneAndUpdate(
    {slug},{$set:{name: name,slug: slugify(name)}},
    {new: true}
   );

   return categoryUpdate;
  
};

const categoryDelete = async (slug) => {

    return await Category.findOneAndDelete({ slug });
  
};


module.exports = {
    categoryCreate,
    getCategories,
    getCategory,
    categoryUpdate,
    categoryDelete
};
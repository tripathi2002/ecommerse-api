const asyncHandler = require('express-async-handler');

const Category = require('../models/blog.category.model');
const { validateMongodbId } = require('../utils/validateMongodbId');

/** POST: 127.0.0.1:1000/api/productCategory
 * body: {
    "title": "Watch"
    }
 */
const createCategory = asyncHandler( async (req,res)=>{
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    }catch(err){
        throw new Error(err);
    }
});

const updateCategory = asyncHandler( async(req,res)=>{
    const { id } = req.params;
    try{
        const updatedCategory = await Category.findByIdAndUpdate( id, req.body, {
            new: true,
        });
        res.json(updatedCategory);
    }catch(err){
        throw new Error(err);
    }
});

const getCategory = asyncHandler( async(req,res)=>{
    const { id } = req.params;
    try{
        const category = await Category.findById(id);
        res.json(category);
    }catch(err){
        throw new Error(err);
    }
});

const getAllCategory = asyncHandler( async(req,res)=>{
    try{
        const categories = await Category.find();
        res.json({ count: categories.length , categories});
    }catch(err){
        throw new Error(err);
    }
});

const deleteCategory = asyncHandler( async(req,res)=>{
    const { id } = req.params;
    try{
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    }catch(err){
        throw new Error(err);
    }
});


module.exports = {
    createCategory, updateCategory,
    deleteCategory,
    getCategory, getAllCategory,
}
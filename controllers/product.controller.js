
const asyncHandler = require('express-async-handler'); 
const slugify = require('slugify');

const Product = require('../models/product.model');

// Create Product
/** POST: http://127.0.0.1:1000/api/product/
 * body: {
    "title":"Apple Watch",
    "description": "Watch for Men, Casual",
    "price":500, 
    "quantity": 120  
 }
*/
const createProduct = asyncHandler( async (req, res)=>{
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }catch(err){
        throw new Error(err);
    }
    // res.send("good good");
});

// update Product
/** PUT: http://127.0.0.1:1000/api/product/:id 
 * body: {
    "title":"Apple Watch",
    "description": "Watch for Men, Casual",
    "price":500, 
    "quantity": 120  
 }
*/
const updateProduct = asyncHandler( async (req, res)=>{
    const { id } = req.params;
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate( id, req.body, {
            new: true,
        });
        res.json(updatedProduct);
    }catch(err){
        throw new Error(err);
    }
});

// Delete Product 
/** DELETE: http://127.0.0.1:1000/api/product/:id */
const deleteProduct = asyncHandler( async (req, res)=>{
    const { id } = req.params;
    try{
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.json(deletedProduct);
    }catch(err){
        throw new Error(err);
    }
});

// get a Product 
const getaProduct = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    try{
        const product = await Product.findById(id);
        if(!product) throw new Error("Product not found!");
        res.json({
            product
        });
    }catch(err){
        throw new Error(err);
    }
});

// get all Product 
const getAllProduct = asyncHandler(async (req, res)=>{
    try{
        const queryObj = { ...req.query };
        /* Ony for lower version of mongodb 6.0 or less  */
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach( el => delete queryObj[el]);


        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lte)\b/g, (match) => `$${match}`);
        queryStr = JSON.parse(queryStr);
        console.log(queryStr );

        // const products = await Product.find(queryStr);
        let query = Product.find(queryStr);

        // Sorting 
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query.sort('-createdAt');
        }

        // limiting the fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            console.log(fields);
            query = query.select(fields);
        }else{
            query = query.select('-__v -updatedAt -sold');
        }

        // pagination 
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page-1)*limit;

        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount) throw new Error('This Page does not Exists')
        }
        query = query.skip(skip).limit(limit);

        const product = await query;
        if(!product) throw new Error('Products not found!');
        res.json( {
            count: product.length,
            product 
        } );
    }catch(err){
        throw new Error(err);
    }
});

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
}

const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const Product = require('../models/product.model');
const User = require('../models/user.model');
const { validateMongodbId } = require('../utils/validateMongodbId');
const { cloudinaryUploadImg } = require('../utils/cloudinary');
const fs = require('fs');

// Create Product
/** POST: http://127.0.0.1:1000/api/product/
 * body: {
    "title":"Apple Watch",
    "description": "Watch for Men, Casual",
    "price":500, 
    "quantity": 120  
 }
*/
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (err) {
        throw new Error(err);
    }
    // res.send("good good");
});

// Update Product
/** PUT: http://127.0.0.1:1000/api/product/:id 
 * body: {
    "title":"Apple Watch",
    "description": "Watch for Men, Casual",
    "price":500, 
    "quantity": 120  
 }
*/
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedProduct);
    } catch (err) {
        throw new Error(err);
    }
});

// Delete Product 
/** DELETE: http://127.0.0.1:1000/api/product/:id */
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.json(deletedProduct);
    } catch (err) {
        throw new Error(err);
    }
});

// Get a Product 
/* GET: http://127.0.0.1:1000/api/product/:id
*/
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        // const product = await Product.findById(id);
        const product = await Product.findById(id).populate('category brand');
        if (!product) throw new Error("Product not found!");
        res.json({
            product
        });
    } catch (err) {
        throw new Error(err);
    }
});

// Get all Product 
/* GET:  http://127.0.0.1:1000/api/product
/* url:  http://127.0.0.1:1000/api/product?sort=category,brand
    * product?fields=-__v,-sold
*/
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const queryObj = { ...req.query };
        /* Ony for lower version of mongodb 6.0 or less  */
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lte)\b/g, (match) => `$${match}`);
        queryStr = JSON.parse(queryStr);
        // console.log(queryStr);

        // const products = await Product.find(queryStr);
        let query = Product.find(queryStr);

        // Sorting 
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query.sort('-createdAt');
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            // console.log(fields);
            query = query.select(fields);
        } else {
            query = query.select('-__v -updatedAt -sold');
        }

        // pagination 
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This Page does not Exists')
        }
        query = query.skip(skip).limit(limit).populate('category brand');

        const product = await query;
        if (!product) throw new Error('Products not found!');
        return res.json({
            count: product.length,
            product
        });
    } catch (err) {
        throw new Error(err);
    }
});

// add to wishlist 
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);

        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId },
            }, {
                new: true,
            });
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId },
            }, {
                new: true,
            });
            res.json(user);
        }
    } catch (err) {
        throw new Error(err);
    }
});

// giving ratings 
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, prodId } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());
        if (alreadyRated) {
            // console.log(alreadyRated);
            // ratings: { $elemMatch: alreadyRated} // use this one 
            let updatedRating = await Product.updateOne({
                _id: prodId,
                ratings: { $elemMatch: alreadyRated },
            }, {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment,
                },
            }, {
                new: true,
            });
            // res.json(updatedRating);
        } else {
            let ratedProduct = await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedby: _id,
                    }
                },
            }, {
                new: true,
            });
            // res.json(ratedProduct);
        }

        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        console.log(totalRating, actualRating);
        const finalProduct = await Product.findByIdAndUpdate(prodId, {
            totalrating: actualRating,
        }, {
            new: true,
        });
        res.json(finalProduct);
    } catch (err) {
        throw new Error(err);
    }

});

// Upload images file url 
/** PUT: http://127.0.0.1:1000/api/product/upload/:id
 * files: {
 }
 * body: {
 }
*/
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        let urls = [];
        const files = req.files;
        for (let file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map(file => file)
        }, {
            new: true,
        });
        res.json(findProduct);
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = {
    createProduct,
    getaProduct, getAllProduct,
    updateProduct, deleteProduct,
    addToWishlist, rating,
    uploadImages,
}
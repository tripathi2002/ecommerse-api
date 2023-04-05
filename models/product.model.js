const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model 
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required field'],
        trim: true,
    },
    slug:{
        type: String,
        required: [true, 'Slug is required field'], 
        unique: [true, 'Slug must be unique'],
        lowercase: true,
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'Price is a required field!'],
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref:  'Category',
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        requird: true,
    },
    sold: {
        type: Number,
        default: 0,
        // select: false
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        // enum: ['Black', 'Brown', 'Red'],
        required: true,
    },
    brand: {
        type: String,
        // enum: ['Apple', 'Samsung', 'Lenovo'],
        required: true,
    },
    ratings: [
        {
            star: Number,
            comment: {
                type: String,
            },
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        },
    ],
    totalrating:{
        type: Number,
        default: 0,
    }
}, { 
    timestamps: true,
});

// Export the model 
module.exports = mongoose.model('Product', productSchema);
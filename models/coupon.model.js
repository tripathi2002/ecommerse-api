const mongoose = require('mongoose');

// Declare the Schema of the Coupon Model 
var couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
        uppercase: true,
    },
    expiry: {
        type: Date, 
        required: true, 
    }, 
    discount: {
        type: Number, 
        required: true,
    },
});

// Export the model 
module.exports = mongoose.model('Coupon', couponSchema); 
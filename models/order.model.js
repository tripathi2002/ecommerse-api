const mongoose = require('mongoose');

// Declare the Schema of the Order model 
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: Number,
            color: String,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String, 
        default: 'Not Processed',
        enum: [
            'Not Processed','Cash on Delivery','Processing','Disptch','Cancelled','Delivered',
        ],
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// Exports the Model 
module.exports = mongoose.model('Order', orderSchema);
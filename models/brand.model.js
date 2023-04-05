const mongoose = require('mongoose');

// declare the Schema of the Brand model 
var brandSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        unique: true, 
        index: true,
    },
}, {
    timestamps: true,
});

// Export the model 
module.exports = mongoose.model('Brand', brandSchema);
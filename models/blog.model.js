const mongoose = require('mongoose');

// Declare the schema of the blog model  
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    image: {
        type: String, 
        default: 
            "https://www.bing.com/images/search?view=detailV2&ccid=X%2bBqeuY%2b&id=DEAA4E845F9986B35448FFFB1CF6203107FFB628&thid=OIP.X-BqeuY-fo0fSF8uuqT85AHaEP&mediaurl=https%3a%2f%2fwww.onblastblog.com%2fwp-content%2fuploads%2f2017%2f08%2fblogger-logo.jpg&exph=1043&expw=1822&q=logo+for+blog&simid=608021847515016222&FORM=IRPRST&ck=640AD63C69B91EAFF940B6D6B8347430&selectedIndex=0",
    },
    author: {
        type: String,
        default: 'Admin',
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});

// Export the blog model
module.exports = mongoose.model('Blog', blogSchema);
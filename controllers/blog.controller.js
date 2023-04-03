const Blog = require('../models/blog.model');
const User = require('../models/user.model');

const expressAsyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validateMongodbId');

/** POST: {{base_url}}/blog 
 * body: {
    "title": "My blog 1",
    "category": "IT",
    "description": "My blog description",
}
*/
const createBlog = expressAsyncHandler(async (req, res)=>{
    try{
        const newBlog = await Blog.create(req.body);
        res.json( newBlog );
    }catch(err){
        throw new Error(err);
    }
});

/** PUT: {{base_url}}/blog/:id 
 * body: {
    "title": "My blog 2",
    "description": "My blog updated description"
}
*/
const updateBlog = expressAsyncHandler( async (req, res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const updatedBlog = await Blog.findByIdAndUpdate( id, req.body, {
            new: true,
        });
        res.json(updatedBlog);
    }catch(err){
        throw new Error(err);
    }
});

/** GET: {{base_url}}/blog/:id */
const getBlog = expressAsyncHandler( async (req, res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        // const blog = await Blog.findById(id);
        const blog = await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1},
        }, {
            new: true,
        }).populate("likes")
        .populate("dislikes");
        res.json(blog);
    }catch(err){
        throw new Error(err);
    }
});

/** GET: {{base_url}}/blog/:id */
const getAllBlog = expressAsyncHandler( async (req, res)=>{
    try{ 
        const getBlogs = await Blog.find();
        res.json({
            count: getBlogs.length,
            getBlogs
        });
    }catch(err){
        throw new Error(err);
    }
});

/** DELETE: {{base_url}}/blog/:id  */
const deleteBlog = expressAsyncHandler( async (req, res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    }catch(err){
        throw new Error(err);
    }
});

const likeBlog = expressAsyncHandler( async( req, res)=>{
    const { blogId } = req.body;
    validateMongodbId(blogId);
    try{
        // Find the blog which you want to like 
        const blog = await Blog.findById(blogId);
        // find the login user
        // const loginUserId = req?.user?.id;  // its give us string
        const loginUserId = req?.user?._id; // its give us new ObjectId("")
        // console.log(loginUserId)
        // find if user has liked the blog
        const isLiked = blog?.isLiked;
        // console.log(isLiked);
        // find if user has disliked the blog 
        const alreadyDisliked = blog?.dislikes?.find(
            (userId)=> userId?.toString() == loginUserId?.toString()
        );
        // console.log(alreadyDisliked);
        if(alreadyDisliked){
            // console.log("like blog already disliked");
            const blog = await Blog.findByIdAndUpdate(
                blogId, {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false,
                }, {
                    new: true,
            }); 
        } if(isLiked){
            // console.log("like blog already isLiked");
            const blog = await Blog.findByIdAndUpdate( blogId, {
                $pull: { likes: loginUserId }, 
                isLiked: false,
            }, {
                new: true,
            });
            res.json(blog);
        } else {
            // console.log("like blog already else");
            const blog = await Blog.findByIdAndUpdate( blogId, {
                $push: { likes: loginUserId },
                isLiked: true, 
            }, {
                new: true,
            });
            res.json(blog);
        }
    }catch(err){
        throw new Error(err);
    }
});

const dislikeBlog = expressAsyncHandler( async (req, res)=>{
    const { blogId } = req.body;
    validateMongodbId(blogId);
    try{
        const blog = await Blog.findById(blogId);
        // console.log(blog)
        const loginUserId = req?.user?._id;
        // console.log(loginUserId);

        const isDisliked = blog?.isDisliked;
        // console.log(isDisliked)

        var alreadyLiked = blog?.likes?.find(
            (userId) => userId?.toString() === loginUserId?.toString()
        );
        
        // console.log(alreadyLiked);
        if(alreadyLiked){
            // console.log("hello already liked");
            const blog = await Blog.findByIdAndUpdate( blogId, {
                $pull: { likes: loginUserId },
                isLiked: false,
            }, {
                new: true,
            });
        } if(isDisliked){
            const blog = await Blog.findByIdAndUpdate( blogId, {
                $pull: { dislikes: loginUserId},
                isDisliked: false,
            }, {
                new: true,
            });
             return res.json(blog);
        } else {
            const blog = await Blog.findByIdAndUpdate( blogId, {
                $push: { dislikes: loginUserId },
                 isDisliked: true,
            }, {
                new: true,
            });
            res.json(blog);
        }
    }catch(err){
        throw new Error(err);
    }
});

module.exports = {
    createBlog, updateBlog,
    getBlog, getAllBlog,
    deleteBlog,
    likeBlog, dislikeBlog,
}
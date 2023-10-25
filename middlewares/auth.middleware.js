const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next)=>{
    let token; 
    if(req?.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
        // console.log(token);
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded);
                const user = await User.findById(decoded?.id);
                // console.log(user);
                req.user = user;
                next();
            }
        }catch(err){
            throw new Error("Authorization token Expired, Please Login Again!");
        }
    }else{
        throw new Error('There is no token attached to header');
    }
});

const isAdmin = asyncHandler(async (req,res,next)=>{
    // console.log(req.user);
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== "admin"){
        throw new Error("You are not an Admin");
    }else{
        next();
    }
});


module.exports = {
    authMiddleware,
    isAdmin,
}
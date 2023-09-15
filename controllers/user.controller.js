const jwt = require('jsonwebtoken');

const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const User = require('../models/user.model');
const asyncHandler =  require('express-async-handler');
const { validateMongodbId } = require('../utils/validateMongodbId');

// create a user
/** POST: http://127.0.0.1:1000/api/user/register
 *body: {
    "email":"example@123",
    "password":"admin@123",
    "firstName":"example",
    "lastName":"123",
    "mobile":"7081229558"
 }
*/
const createUser = asyncHandler(async (req, res) => {
    // const email = req.body.email;
    const {email} = req.body;

    const findUser = await User.findOne({email});
    if (!findUser) {
        const newUser = await User.create(req.body);
        // const newUser = User.create(req.body);
        res.json({ newUser })
    } else {
        throw new Error('User Already Exists');
    }
});

// login a user
/** POST: http://127.0.0.1:1000/api/user/login 
* body:{
    "email":"example@123",
    "password":"admin@123"
 }
*/
const loginUser = asyncHandler(async (req,res)=>{
    const {email, password } = req.body;

    // check if user exists or not 
    const findUser = await User.findOne({ email });

    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateuser = await User.findByIdAndUpdate( findUser?.id, {
            refreshToken: refreshToken, 
        }, {
            new: true 
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72*60*60*1000,
        });
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials");
    }
});

// login a Admin
/** POST: http://127.0.0.1:1000/api/user/admin-login
* body:{
    "email":"example@123",
    "password":"admin@123"
 }
*/
const loginAdmin = asyncHandler(async (req,res)=>{
    const {email, password } = req.body;

    // check if user exists or not
    const findUser = await User.findOne({ email });
    if(findUser.role !== 'admin') throw new Error('you are not admin');

    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateuser = await User.findByIdAndUpdate( findUser?.id, {
            refreshToken: refreshToken,
        }, {
            new: true
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72*60*60*1000,
        });
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials");
    }
});

// handle refresh token 
const handleRefreshToken = asyncHandler(async (req, res)=>{
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);

    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error('No Refresh token persent in db or not matched');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
        // console.log(user.id, decoded.id)
        if(err || user.id !== decoded.id){
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

//  logout 
const logout = asyncHandler( async (req, res)=>{
    const cookie = req.cookies; 
    if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user =  await User.findOne({ refreshToken });
    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden 
    }
    await User.findOneAndUpdate( refreshToken, {
        refreshToken: ""
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204); // forbidden 
});

// Update a user 
/** PUT: http://127.0.0.1:1000/api/user/edit-user 
 * PUT: http://127.0.0.1:1000/api/user/:id  
* body:{
    "firstName":"example@123"
 } */
const updateUser = asyncHandler(async (req, res)=>{
    // const { id } = req.params;
    const { id } = req.user;
    validateMongodbId(id);

    try{
        // const updateUser = await User.findByIdAndUpdate(id, req.body);
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new:true
        });

        res.json(updatedUser);
    }catch(err){
        throw new Error(err);
    }
})

// get a single user 
/** GET: http://127.0.0.1:1000/api/user/:id */
const  getaUser = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongodbId(id);

    try{
        const user = await User.findById(id);
        // const user = await User.findOne({_id: id});
        res.json(user);
    }catch(err){
        throw new Error(err);
    }
});

// Get all user
/** GET: http://127.0.0.1:1000/api/user/allUser */
const getAllUser = asyncHandler(async(req,res)=>{
    try{
        const users = await User.find();
        res.json({
            count: users.length,
            users,
        });
    }catch(err){
        throw new Error(err);
    }
});

// delete user 
/** DELETE: http://127.0.0.1:1000/api/user/:id */
const deleteUser = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);
    }catch(err){
        throw new Error(err);
    }
});

// delete all user
/** DELETE: http://127.0.0.1:1000/api/user/allUser/:id */
const deleteAllUser = asyncHandler(async (req,res)=>{
    try{
        const deletedUser = await User.deleteMany();
        res.json(deletedUser);
    }catch(err){
        throw new Error(err);
    }
});

// block user
/** PUT: http://127.0.0.1:1000/api/user/block-user/:id */
const blockUser = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const blockedUser = await User.findByIdAndUpdate(id, {
            isBlocked: true 
        }, { 
            new : true, 
        });

        res.json({
            message: "User Blocked!",
            blockedUser
        });
    }catch(err){
        throw new Error(err);
    }
});

// unblock user
/** PUT: http://127.0.0.1:1000/api/user/unblock-user/:id */
const unblockUser = asyncHandler(async (req, res)=>{
    const { id } = req.params; 
    validateMongodbId(id);
    try{
        const unblockedUser = await User.findByIdAndUpdate(id, {
            isBlocked: false, 
        }, {
            new: true,
        });

        res.json({
            message: "User Unblocked!",
            unblockedUser
        });
    }catch(err){
        throw new Error(err);
    }
});

// get wishlist 
/** GET: http://127.0.0.1:1000/api/user/wishlist */
const getWishlist = asyncHandler(async (req,res)=>{
    const { _id } = req.user;
    try{
        const wishlist = await User.findById(_id).populate("wishlist");
        res.json(wishlist);
    }catch(err){
        throw new Error(err);
    }
});

// save user Address
/** PUT: http://127.0.0.1:1000/api/user/save-address
 * body:{
    "address":" my address"
   } 
*/
const saveAddress = asyncHandler( async (req,res)=>{
    const { _id } = req.user;
    validateMongodbId(_id);
    try{
        const updateUser = await User.findByIdAndUpdate( _id, {
            address: req?.body?.address,
        }, {
            new: true,
        });
        res.json(updateUser);
    }catch(err){
        throw new Error(err);
    }
});


module.exports = {
    createUser, loginUser, logout, loginAdmin,
    getAllUser, getaUser,
    deleteUser, updateUser,
    deleteAllUser,
    blockUser,unblockUser,
    handleRefreshToken,
    getWishlist,
    saveAddress, 
}
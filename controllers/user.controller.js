const { generateToken } = require('../config/jwtToken');
const User = require('../models/user.model');
const asyncHandler =  require('express-async-handler');

// create a user
/** POST: http://127.0.0.1:1000/api/user/register
 *body: {
    "email":"example@123",
    "password":"admin@123",
    "firstName":"example123",
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
    // console.log(email, password)

    // check if user exists or not 
    const findUser = await User.findOne({ email });
    if(findUser && (await findUser.isPasswordMatched(password))){

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
})

// Update a user 
/** PUT: http://127.0.0.1:1000/api/user/:id  
* body:{
    "firstName":"example@123"
 } */
const updateUser = asyncHandler(async (req, res)=>{
    const { id } = req.params;
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

// Get all user
/** GET: http://127.0.0.1:1000/api/user/allUser */
const getAllUser = asyncHandler(async(req,res)=>{
    try{
        const Users = await User.find();
        res.json(Users);
    }catch(err){
        throw new Error(err);
    }
});

// get user 
/** GET: http://127.0.0.1:1000/api/user/:id */
const  getaUser = asyncHandler(async (req,res)=>{
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        // const user = await User.findOne({_id: id});
        res.json(user);
    }catch(err){
        throw new Error(err);
    }
});

// delete user 
/** DELETE: http://127.0.0.1:1000/api/user/:id */
const deleteUser = asyncHandler(async (req,res)=>{
    try{
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);
    }catch(err){
        throw new Error(err);
    }
})
const deleteAllUser = asyncHandler(async (req,res)=>{
    try{
        const deletedUser = await User.deleteMany();
        res.json(deletedUser);
    }catch(err){
        throw new Error(err);
    }
})

module.exports = {
    createUser,
    loginUser,
    getAllUser,
    getaUser,
    deleteUser,
    updateUser,
    deleteAllUser,

}
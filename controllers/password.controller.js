const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validateMongodbId');
const User = require('../models/user.model');
const { sendEmail } = require('./email.controller');
const crypto = require('crypto');

const updatePassword = asyncHandler(async (req, res)=>{
    const { id } = req.user; 
    console.log(id);
    const {password} = req.body;
    validateMongodbId(id);
    const user = await User.findById(id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json( user );
    }
});

const forgotPasswordToken = asyncHandler( async (req, res)=>{
    const { email } = req.body;
    const user = await User.findOne({email});

    if(!user) throw new Error('User not found with this email');
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const data = {
            email, 
            name: user.name,
            subject: "Forget Password Link",
            token
        }
        sendEmail(data);

        res.json(token);
    }catch(err){
        throw new Error(err);
    }
});

const resetPassword = asyncHandler(async (req, res)=>{
    const { password } = req.body;
    const { token } = req.params; 
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken, 
        passwordResetExpires: { $gt: Date.now() },
    });
    if(!user) throw new Error('Token Expired, Please try again later');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json(user);
})


module.exports = {
    updatePassword,
    forgotPasswordToken,
    resetPassword
}
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt'); 
const crypto = require('crypto');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        // required:[true, 'First Name  must be required']
    },
    lastName:{
        type:String,
        // required:[false, 'Last Name must be required'],
    },
    email:{
        type:String,
        // required:[true, 'email  must be required'],
        // unique:[true, 'please use unique email id'],
    },
    mobile:{
        type:String,
        // required:[false, 'mobile must be required'],
        unique:[true, 'please use unique mobile number'],
    },
    password:{
        type:String,
        // required:[true, 'password  must be required'],
    },
    role: {
        type: String,
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    // address: { type: String, }, 
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }], 
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
    refreshToken: { 
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    var salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password); 
}

userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        // console.log(Date().now);
    this.passwordResetExpires = Date.now() + 30*60*1000;    // 30 minutes
    return resetToken;
}

//Export the model
module.exports = mongoose.model('User', userSchema);
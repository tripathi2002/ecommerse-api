const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, 'First Name  must be required']
    },
    lastName:{
        type:String,
        // required:[false, 'Last Name must be required'],
    },
    email:{
        type:String,
        required:[true, 'email  must be required'],
        unique:[true, 'please use unique email id'],
    },
    mobile:{
        type:String,
        // required:[false, 'mobile must be required'],
        unique:[true, 'please use unique mobile number'],
    },
    password:{
        type:String,
        required:[true, 'password  must be required'],
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
        dfault: [],
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
}, {
    timestamps: true
});


// , {
//     timestamps:true
// }

userSchema.pre('save', async function(nex){
    var salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password); 
}

//Export the model
module.exports = mongoose.model('User', userSchema);
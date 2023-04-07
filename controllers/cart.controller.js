const asyncHandler = require("express-async-handler");
const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Coupon = require('../models/coupon.model');
const { validateMongodbId } = require('../utils/validateMongodbId');

/** POST: http://127.0.0.1:1000/api/cart 
 * body: {
    "cart":[
        {
            "_id":"64298714c3c214481866936f",
            "count": 3,
            "color": "blue"
        }, 
        {
            "_id": "64298e766ae2657376854746",
            "count": 2,
            "color": "green"
        }
    ]
}
*/
const addToCart = asyncHandler(async (req, res)=>{
    // res.send('Hello from cart');
    const { cart } = req.body; 
    const { _id } = req.user;
    validateMongodbId(_id);
    try{
        let products = [];
        const user = await User.findById(_id);
        // check if user already have product in cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id});
        if(alreadyExistCart){
            // alreadyExistCart.remove();  // create it later
        }
        for(let i=0;i<cart.length;i++){
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count; 
            object.color = cart[i].color; 
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for(let i=0;i<products.length;i++){
            cartTotal += products[i].price * products[i].count;
        }
        // console.log(products, cartTotal);
        let newCart = new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        });
        await newCart.save();
        res.json(newCart);
    }catch(err){
        throw new Error(err);
    }
});

/** GET: http://127.0.0.1:1000/api/cart */
const getCart = asyncHandler(async(req,res)=>{
    const { _id } = req.user;
    validateMongodbId(_id);
    try{
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product");
        res.json(cart);
    }catch(err){
        throw new Error(err);
    }
});

/** GET: http://127.0.0.1:1000/api/cart/empty-cart */
const emptyCart = asyncHandler( async (req,res)=>{
    const { _id } = req.user;
    validateMongodbId(_id);
    try{
        const user = await User.findById(_id);
        const cart = await Cart.findOneAndRemove({ orderby: user._id });
        res.json(cart);
    }catch(err){
        throw new Error(err);
    }
});

const applyCoupon = asyncHandler(async (req, res)=>{
    const { _id } = req.user;
    const { coupon } = req.body; 
    const validCoupon = await Coupon.findOne({ name: coupon });
    // console.log(validCoupon);
    if(validCoupon === null) throw new Error("Invalid Coupon");
    
    const user = await User.findById({ _id });
    let { cartTotal } = await Cart.findOne({
        orderby: user._id,
    }).populate('products.product');
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
    const updatedCart = await Cart.findOneAndUpdate({
        orderby: user._id,
    }, {
        totalAfterDiscount
    }, {
        new: true
    });
    res.json(updatedCart);
});


module.exports = {
    addToCart,  getCart,
    emptyCart,
    applyCoupon,
}
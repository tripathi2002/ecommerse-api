const Coupon = require('../models/coupon.model');
const asyncHandler = require('express-async-handler');

const { validateMongodbId } = require('../utils/validateMongodbId');

const createCoupon = asyncHandler( async (req, res)=>{
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const getAllCoupon = asyncHandler( async (req, res)=>{
    try{
        const coupons = await Coupon.find();
        res.json(coupons);
    }catch(err){
        throw new Error(err);
    }
});

const updateCoupon = asyncHandler(async (req, res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const updatedCoupon = await Coupon.findByIdAndUpdate( id, req.body, { new: true});
        res.json(updatedCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const deleteCoupon = asyncHandler( async (req, res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete( id, { new: true });
        res.json(deletedCoupon);
    }catch(err){
        throw new Error(err);
    }
});

module.exports = {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
}
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controllers/coupon.controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.get('/', getAllCoupon);

router.post('/', authMiddleware, isAdmin, createCoupon);

router.put('/:id', authMiddleware, isAdmin, updateCoupon);

router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
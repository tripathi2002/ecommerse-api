const { addToCart, getCart, 
    emptyCart, applyCoupon 
} = require('../controllers/cart.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = require('express').Router();


router.post('/', authMiddleware, addToCart);
router.post('/applycoupon', authMiddleware, applyCoupon);

router.get('/', authMiddleware, getCart);

router.delete('/empty-cart', authMiddleware, emptyCart);

module.exports = router;
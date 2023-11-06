const { addToCart, getCart, 
    emptyCart, applyCoupon, getAllCart, emptyItemCart 
} = require('../controllers/cart.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.post('/', authMiddleware, addToCart);
router.post('/applycoupon', authMiddleware, applyCoupon);

router.get('/', authMiddleware, getCart);
router.get('/list', authMiddleware, getAllCart);

router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/empty-cart/:id', authMiddleware, emptyItemCart);

module.exports = router;
const router = require('express').Router();

const { isAdmin, authMiddleware } = require('../middlewares/auth.middleware');

const { createProduct, 
    getaProduct, getAllProduct, 
    updateProduct, deleteProduct, 
    addToWishlist, rating, 
} = require('../controllers/product.controller');


router.get('/', getAllProduct);
router.get('/:id', getaProduct);

router.post('/', authMiddleware, isAdmin, createProduct);

router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/rating', authMiddleware, rating)
router.put('/:id', authMiddleware, isAdmin, updateProduct);

router.delete('/:id', authMiddleware, isAdmin, deleteProduct);


module.exports = router;
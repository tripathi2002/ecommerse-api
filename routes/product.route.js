const router = require('express').Router();

const { isAdmin, authMiddleware } = require('../middlewares/auth.middleware');

const { createProduct, 
    getaProduct, getAllProduct, 
    updateProduct, deleteProduct, 
    addToWishlist, rating, uploadImages, 
} = require('../controllers/product.controller');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');


router.get('/', getAllProduct);
router.get('/:id', getaProduct);

router.post('/', authMiddleware, isAdmin, createProduct);

router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/rating', authMiddleware, rating);
router.put('/:id', authMiddleware, isAdmin, updateProduct);

router.put('/upload/:id', authMiddleware, isAdmin, 
    uploadPhoto.array('images', 5), 
    productImgResize, 
    uploadImages
);

router.delete('/:id', authMiddleware, isAdmin, deleteProduct);


module.exports = router;
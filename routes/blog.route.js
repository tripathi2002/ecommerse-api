const router = require('express').Router();

const { createBlog, updateBlog,
    getBlog, getAllBlog,
    deleteBlog, 
    likeBlog, dislikeBlog,
    uploadImages } = require('../controllers/blog.controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');


router.post('/', authMiddleware, isAdmin, createBlog);

router.put('/like', authMiddleware, likeBlog);
router.put('/dislike', authMiddleware, dislikeBlog);

router.put('/:id', authMiddleware, isAdmin, updateBlog);

router.put('/upload/:id', authMiddleware, isAdmin, 
    uploadPhoto.array('images', 2),
    blogImgResize,
    uploadImages
);

router.delete('/:id', authMiddleware, isAdmin, deleteBlog)

router.get('/:id', getBlog);
router.get('/', getAllBlog);


module.exports = router;
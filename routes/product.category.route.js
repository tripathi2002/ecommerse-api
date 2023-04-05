const { createCategory, updateCategory, 
    deleteCategory, 
    getCategory, getAllCategory } = require("../controllers/product.category.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.get('/:id', getCategory);
router.get('/', getAllCategory);

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

module.exports = router;
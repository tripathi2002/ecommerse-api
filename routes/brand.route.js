const { createBrand, updateBrand, 
    deleteBrand, 
    getBrand, getAllBrand } = require("../controllers/brand.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.get('/', getAllBrand);
router.get('/:id', getBrand);

router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);

module.exports = router;
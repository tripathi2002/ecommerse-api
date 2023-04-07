const router = require('express').Router();

const { createOrder, getOrder, updateOrderStatus } = require('../controllers/order.controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');


router.post('/', authMiddleware, createOrder);

router.get('/', authMiddleware, getOrder);

router.put('/update-status/:id', authMiddleware, isAdmin, updateOrderStatus);


module.exports = router;
const router = require('express').Router();

const { createOrder, getOrder, updateOrderStatus, getAllOrder } = require('../controllers/order.controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');


router.post('/', authMiddleware, createOrder);

router.get('/', authMiddleware, getOrder);
router.get('/all', authMiddleware, isAdmin, getAllOrder);

router.put('/update-status/:id', authMiddleware, isAdmin, updateOrderStatus);


module.exports = router;
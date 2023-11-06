const router = require('express').Router();

const { createOrder, getOrder, updateOrderStatus, getAllOrder, getUserOrder, getUserOrders, createAllOrder } = require('../controllers/order.controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');


router.post('/', authMiddleware, createOrder);
router.post('/list', authMiddleware, createAllOrder);

router.get('/', authMiddleware, getUserOrders);
router.get('/list', authMiddleware, isAdmin, getAllOrder);
router.get('/:id', authMiddleware, getUserOrder)
router.get('/list/:id', authMiddleware, isAdmin, getOrder)


router.put('/update-status/:id', authMiddleware, isAdmin, updateOrderStatus);


module.exports = router;
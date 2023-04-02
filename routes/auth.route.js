const { createUser, loginUser, 
    getAllUser, getaUser, 
    deleteUser, deleteAllUser, 
    updateUser, 
    blockUser, unblockUser, 
    handleRefreshToken, logout } = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');

const router = require('express').Router();

// routes the request 
router.post('/register', createUser);
router.post('/login', loginUser);

// router.get('/:id', getaUser);
router.get('/allUser', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);

router.get('/:id', authMiddleware, isAdmin, getaUser);

router.delete('/:id', deleteUser);
// router.delete('/allUser/:id', deleteAllUser);

// router.put('/:id', updateUser)
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
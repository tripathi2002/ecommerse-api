const { createUser, loginUser, 
    getAllUser, getaUser, 
    deleteUser, deleteAllUser, 
    updateUser, logout,
    blockUser, unblockUser, 
    handleRefreshToken, 
    getWishlist,
    saveAddress} = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');
const { updatePassword, forgotPasswordToken, resetPassword } = require('../controllers/password.controller');
const { sendEmail } = require('../controllers/email.controller');

const router = require('express').Router();

// routes the request 
router.post('/register', createUser);
router.post('/login', loginUser);

// router.get('/:id', getaUser);
router.get('/allUser', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/wishlist', authMiddleware, getWishlist)

router.get('/:id', authMiddleware, isAdmin, getaUser);

router.delete('/:id', deleteUser);
// router.delete('/allUser/:id', deleteAllUser);

// router.put('/:id', updateUser)
router.put('/edit-user', authMiddleware, updateUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

// password router 
router.post('/forgot-password-token', forgotPasswordToken);

router.put('/password', authMiddleware, updatePassword);
router.put('/reset-password/:token', resetPassword);


module.exports = router;
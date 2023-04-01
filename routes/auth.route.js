const { createUser, loginUser, getAllUser, getaUser, deleteUser, updateUser, deleteAllUser } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = require('express').Router();


router.post('/register', createUser);
router.post('/login', loginUser);

router.get('/allUser', getAllUser);
// router.get('/:id', getaUser);
router.get('/:id', getaUser);

router.delete('/:id', deleteUser);
router.delete('/allUsers/:id', deleteAllUser);

router.put('/:id', updateUser)

module.exports = router;
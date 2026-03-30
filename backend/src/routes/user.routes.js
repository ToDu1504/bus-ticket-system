const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.get('/', auth, authorize('admin'), userController.getUsers);
router.post('/', auth, authorize('admin'), userController.createUser);
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);
router.put('/:id/role', auth, authorize('admin'), userController.updateRole);

module.exports = router;

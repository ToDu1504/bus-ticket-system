const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.get('/', auth, authorize('admin', 'staff'), routeController.getRoutes);
router.post('/', auth, authorize('admin'), routeController.createRoute);
router.put('/:id', auth, authorize('admin'), routeController.updateRoute);
router.delete('/:id', auth, authorize('admin'), routeController.deleteRoute);

module.exports = router;

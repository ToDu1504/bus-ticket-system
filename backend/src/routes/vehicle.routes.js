const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.get('/', auth, authorize('admin', 'staff'), vehicleController.getVehicles);
router.post('/', auth, authorize('admin'), vehicleController.createVehicle);
router.put('/:id', auth, authorize('admin'), vehicleController.updateVehicle);
router.delete('/:id', auth, authorize('admin'), vehicleController.deleteVehicle);

module.exports = router;

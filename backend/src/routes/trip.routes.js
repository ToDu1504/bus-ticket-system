const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.get('/search', tripController.searchTrips);
router.get('/:id', tripController.getTripById);

router.get('/', auth, authorize('admin', 'staff'), tripController.getTrips);
router.post('/', auth, authorize('admin'), tripController.createTrip);
router.put('/:id', auth, authorize('admin'), tripController.updateTrip);
router.delete('/:id', auth, authorize('admin'), tripController.deleteTrip);

module.exports = router;

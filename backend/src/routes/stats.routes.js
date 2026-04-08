const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');
const statsController = require('../controllers/statsController');

router.get('/overview', auth, authorize('admin', 'staff'), statsController.getOverview);
router.get('/revenue-by-month', auth, authorize('admin', 'staff'), statsController.getRevenueByMonth);
router.get('/top-routes', auth, authorize('admin', 'staff'), statsController.getTopRoutes);
router.get('/booking-status', auth, authorize('admin', 'staff'), statsController.getBookingStatus);
router.get('/recent-invoices', auth, authorize('admin', 'staff'), statsController.getRecentInvoices);

module.exports = router;

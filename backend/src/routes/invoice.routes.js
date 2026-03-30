const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.post('/', auth, authorize('customer'), invoiceController.createInvoice);
router.delete('/:id', auth, authorize('customer'), invoiceController.cancelInvoice);
router.get('/my', auth, authorize('customer'), invoiceController.getMyInvoices);

router.get('/', auth, authorize('admin', 'staff'), invoiceController.getAllInvoices);
router.put('/:id/confirm', auth, authorize('admin', 'staff'), invoiceController.confirmInvoice);

module.exports = router;

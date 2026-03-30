const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/role');

// Basic stub. In a real app, query database for aggregate data
router.get('/', auth, authorize('admin', 'staff'), (req, res) => {
  res.json({ message: 'Stats data not fully implemented yet' });
});

module.exports = router;

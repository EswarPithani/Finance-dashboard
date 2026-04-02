const express = require('express');
const { getDashboardSummary, getCategorySummary } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // all routes are protected with auth

router.get('/summary', getDashboardSummary);
router.get('/categories', getCategorySummary);

module.exports = router;
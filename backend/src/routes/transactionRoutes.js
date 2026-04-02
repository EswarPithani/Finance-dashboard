const express = require('express');
const {
    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getTransactions)
    .post(authorize('analyst', 'admin'), createTransaction);

router
    .route('/:id')
    .get(getTransaction)
    .put(authorize('analyst', 'admin'), updateTransaction)
    .delete(authorize('admin'), deleteTransaction);

module.exports = router;
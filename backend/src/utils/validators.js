const { body, validationResult } = require('express-validator');

exports.validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),

    body('role')
        .optional()
        .isIn(['viewer', 'analyst', 'admin']).withMessage('Invalid role')
];

exports.validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required')
];

exports.validateTransaction = [
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),

    body('type')
        .notEmpty().withMessage('Transaction type is required')
        .isIn(['income', 'expense']).withMessage('Type must be either income or expense'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['food', 'transport', 'utilities', 'entertainment', 'salary', 'investment', 'other'])
        .withMessage('Invalid category'),

    body('date')
        .optional()
        .isISO8601().withMessage('Invalid date format'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters')
];


exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};
const { body } = require('express-validator');
const router = require('express').Router();
const { createRegister, login } = require('../controllers/auth');

const authValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long')
        .notEmpty()
        .withMessage('Password is required'),
];

router.post('/register', authValidation, createRegister);
router.post('/login', authValidation, login);

module.exports = router;

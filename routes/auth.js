const { body } = require('express-validator');
const router = require('express').Router();
const { register, login } = require('../controllers/auth');
const { validate } = require('../middlewares/validation');

const authValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long')
        .notEmpty()
        .withMessage('Password is required'),
];

router.post('/register', authValidation, validate, register);
router.post('/login', authValidation, validate, login);

module.exports = router;

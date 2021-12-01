const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { User, FavoriteMovie } = require('../models');

// @route   POST  localhost:8000/api/register
// @desc    route register
// @access  Public
exports.createRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
        //Check user
        // let user = await User.findOne({ where: { name } });
        // if (user) {
        //     return res.status(400).json({ msg: 'User already exists' });
        // }
        let user = {
            name,
            password,
        };

        // Encryt password
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
        user = await User.create(user);

        //payload return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
                name: user.name,
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: 24 * 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        // check error
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST  localhost:8000/api/login
// @desc    route login
// @access  Public
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;
    try {
        //Check user
        let user = await User.findOne({ where: { name } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        // console.log(user);

        // Compare Encryt password
        const isMatch = await user.validPassword(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        //payload return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
                name: user.name,
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: 24 * 3600 },
            // { expiresIn: 10 },
            (err, token) => {
                if (err) throw err;
                req.log.info('something');
                res.json({ token, payload });
            }
        );
    } catch (err) {
        // check error
        console.log(err);
        res.status(500).send('Server Error');
    }
};

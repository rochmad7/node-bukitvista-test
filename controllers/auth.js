const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { User } = require('../models');

exports.register = async (req, res) => {
    const { name, password } = req.body;

    try {
        let user = {
            name,
            password,
        };
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
                res.cookie('session_id', token, {
                    maxAge: 24 * 3600,
                    httpOnly: true,
                });
                res.json({ token });
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Something went wrong');
    }
};

exports.login = async (req, res) => {
    const { name, password } = req.body;
    try {
        //Check user
        let user = await User.findOne({ where: { name } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

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
            (err, token) => {
                if (err) throw err;
                res.cookie('session_id', token, {
                    maxAge: 24 * 3600,
                    httpOnly: true,
                });
                res.json({ token, payload });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong');
    }
};

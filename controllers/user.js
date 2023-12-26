const User = require('../models/user');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;


exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            return res.status(401).json({ success: false, message: "User not exists!" });
        }

        bcrypt.compare(password, existingUser.password, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Something went wrong' });
            }
            if (result === true) {
                res.status(200).json({ success: true, message: 'User logged in successfully', token: generateAccessToken(existingUser.id, existingUser.username) });
            } else {
                res.status(401).json({ success: false, message: 'Password incorrect' });
            }
        });
    } catch (err) {
        console.error('Error user login:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getSignup = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
};

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error hashing password' });
            }

            const userData = await User.create({ username, email, password: hash });
            res.status(201).json({ newUserDetails: userData, message: 'User signup successful' });
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

function generateAccessToken(id, username) {
    console.log('Secret Key:', secretKey);
    
    return jwt.sign({ userId: id , username: username}, secretKey);
}



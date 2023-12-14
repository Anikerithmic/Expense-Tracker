const User = require('../models/user');
const path = require('path');

exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            return res.status(401).json({ error: "User dosen't exists, Signup for new registration!" })
        }
        if (password !== existingUser.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        return res.status(200).json({ error: 'Login successful' });
    }
    catch (error) {
        console.error('Error user login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

exports.signupPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
};

exports.createUser = async (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const userData = await User.create({ username: username, email: email, password: password });
        res.status(201).json({ newUserDetails: userData });

    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


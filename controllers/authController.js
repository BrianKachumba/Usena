// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// User Signup
exports.signup = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;


    try {
        // // Check if user already exists
        // const existingUser = await User.findByEmail(email);
        // if (existingUser) return res.status(400).json({ message: 'User already exists' });
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        console.log('not found');
        const newUser = await User.create({ name, email, password: hashedPassword });
        
        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, userId: newUser.id });
        console.log(res)
    } catch (err) {
        res.status(500).json({ message: 'Error signing up user' });
        console.log(err);
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, userId: user.id });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in user' });
    }
};

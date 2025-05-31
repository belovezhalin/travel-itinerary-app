const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');

const generateRefreshToken = () => {
    return require('crypto').randomBytes(64).toString('hex');
}

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const user = new User({ username, email, password });

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = generateRefreshToken();
        await user.save();

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict'
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 3600000,
            sameSite: 'strict'
        });

        res.status(201).json({
            user: { id: user._id, username, email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict'
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 3600000,
            sameSite: 'strict'
        });

        res.status(200).json({
            user: { id: user._id, username: user.username, email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/refresh-token', async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken) {
            return res.status(400).json({ message: 'Refresh token required' });
        }

        const user = await User.findOne({ refreshToken });
        if(!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict'
        })
        res.json({success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/me', async(req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id.toString(),
            username: user.username,
            email: user.email });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

router.post('/logout', async (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ success: true });
})
module.exports = router;

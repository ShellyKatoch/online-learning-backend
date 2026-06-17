import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, adminCode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('Email already registered');
    }

    // protect admin signups with an environment code
    if (role === 'admin') {
        const code = process.env.ADMIN_SIGNUP_CODE;
        if (!code || adminCode !== code) {
            res.status(403);
            throw new Error('Invalid admin signup code');
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
    });
});

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

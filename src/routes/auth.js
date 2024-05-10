import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userSchema from '../models/User';

export const router = express.Router();

// Registration Route logic
router.post('/register', async (req, res) => {
    try{
        const { name, email, password } = req.body;
        // Check if user with email already exists
        let user = await userSchema.findOne({ email });
        if(user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        user = new userSchema({ name, email, password});
        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // Save user to database
        await user.save();
        res.status(201).json({ message: 'User registered successfully'});
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'})
    }
});

// Login Route logic
router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        // Check if user with email exists
        let user = await userSchema.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid credentials'});
        }
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
});
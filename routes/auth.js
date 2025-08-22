import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Register page
router.get('/register', (req, res) => res.render('register', { title: 'Register Page' }));

// Register User
router.post('/register', async (req, res) => {

    let { username, email, password, passwordAgain } = req.body;
    
    email = email.trim().toLowerCase();
    
    console.log("Registering user:", username, email);
    
    if (password !== passwordAgain) {
        return res.render("register", { 
            title: "Register Page", 
            error: "Passwords do not match",
            username,
            email
        });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render("register", { 
            title: "Register Page", 
            error: "User with this email already exists",
            username,
            email
        });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await User.create({ username, email, password: hashedPassword });
    } catch (err) {
        console.error("Error creating user:", err);
    }
    res.redirect('/auth/login');
});



// Page Login
router.get('/login', (req, res) => res.render('login', { title: 'Login Page' }));

// Login User
router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    
    const user = await User.findOne({ email });
    if (!user) {
        console.log("Login failed: user not found ->", email);
        return res.render("login", { 
            title: "Login Page",
            error: "User not found",
            email
        });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        console.log("Login failed: incorrect password for ->", email);
        return res.render("login", { 
            title: "Login Page",
            error: "Incorrect password",
            email
        });
    }
    
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    
    console.log("Login successful ->", email);
    res.redirect('/pets');
});



// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

export default router;

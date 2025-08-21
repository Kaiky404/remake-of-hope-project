import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Simulated DB
const users = [];

// Register page
router.get('/register', (req, res) => res.render('register', { title: 'Register Page' }));

// Register user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.redirect('/auth/login');
});

// Login page
router.get('/login', (req, res) => res.render('login', { title: 'Login Page' }));

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.send('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('Incorrect password');

    const token = jwt.sign({ username: user.username }, 'secret123', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/pets');
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

export default router;

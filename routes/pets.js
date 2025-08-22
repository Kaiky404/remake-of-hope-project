import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Middleware to protect routes
function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/auth/login');

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.redirect('/auth/login');
    }
}

// Simulated pets DB
const pets = [];

// List pets
router.get('/', authMiddleware, (req, res) => {
    res.render('pets', { pets });
});

// Add pet
router.post('/add', authMiddleware, (req, res) => {
    const { name, type, age } = req.body;
    pets.push({ name, type, age });
    res.redirect('/pets');
});

export default router;

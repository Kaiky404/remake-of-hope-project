import express from 'express';
const router = express.Router();

// Main page
router.get('/', (req, res) => {
    res.render('main', { user: { username: 'Kaiky' }});
});

// About page
router.get('/about', (req, res) => {
    res.render('about', { title: 'About Page' });
});

// Credits page
router.get('/credits', (req, res) => {
    res.render('credits', { title: 'Credits Page' });
});

export default router;

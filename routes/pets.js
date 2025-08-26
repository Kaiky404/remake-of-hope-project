import express from 'express'
import dotenv from 'dotenv'
import Pet from '../models/pet.js'
import authMiddleware from '../middleware/middleware.js'

dotenv.config()
const router = express.Router()

// List pets
router.get('/', authMiddleware, async (req, res) => {
    try {
        let pets;

        if (req.user.role === 'admin') {
            pets = await Pet.find().populate('owner', 'username email')
        } else {
            pets = await Pet.find({ owner: req.user._id })
        }
       res.render('pets', { 
            pets: pets.map(p => ({
                name: p.name,
                type: p.type,
                age: p.age,
                owner: p.owner?.username || null
            })),
            user: { username: req.user.username, role: req.user.role }
        });
        
        
    } catch (e) {
        res.status(500).send('Error fetching pets')
    }
});

// Add pet
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { name, type, age } = req.body

        if (!name || !type || !age) {
            res.status(400).send('All fields are required')
        }

        const exists = await Pet.findOne({ name, owner: req.user._id }) 
        if (exists) {
            return res.status(400).send('You already have a pet with this name')
        }

        await Pet.create({ name, type, age, owner: req.user._id })
        res.redirect('/pets')
    } catch (e) {
        res.status(500).send('Error adding pet')
    }
});

export default router;

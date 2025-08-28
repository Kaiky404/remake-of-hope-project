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
                id: p._id.toString(),
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
})

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
})

// Edit pet
router.patch('/edit/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const { name, type, age } = req.body

        if (!name || !type || !age) {
            return res.status(400).send('All fields are required')
        }

        const pet = await Pet.findById(id)
        if (!pet) {
            return res.status(404).send('Pet not found')
        }

        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).send('Not authorized to edit this pet')
        }

        pet.name = name
        pet.type = type
        pet.age = age
        await pet.save()

        res.redirect('/pets');

    } catch (e) {
        console.error('Error editing pet:', e)
        res.status(500).send('Error editing pet')
    }
})

// delete pet
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).send('Pet not found')
        }

        if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).send('Not authorized to delete this pet')
        }

        await pet.deleteOne()
        res.redirect('/pets');

    } catch (e) {
        console.error('Error deleting pet:', e)
        res.status(500).send('Error deleting pet')
    }
})


export default router;

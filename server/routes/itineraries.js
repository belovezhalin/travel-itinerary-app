const express = require('express');
const Itinerary = require('../models/Itinerary');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const query = {$or: [{ isPublic: true }]};

        if(req.user) {
            query.$or.push({ user: req.user._id });
        }

        const itineraries = await Itinerary.find(query).sort({ updatedAt: -1 });
        res.json(itineraries);
    } catch {
        console.error('Error fetching itineraries:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        if (!itinerary.isPublic && (!req.user || itinerary.user?.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'No access' });
        }
        res.json(itinerary);
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, days, isPublic } = req.body;

        const itinerary = new Itinerary({
            title,
            days,
            isPublic,
            user: req.user ? req.user._id : null
        });

        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (error) {
        console.error('Error creating itinerary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { title, days, isPublic } = req.body;

        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        if (itinerary.user?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No access' });
        }

        itinerary.title = title || itinerary.title;
        if (days) itinerary.days = days;
        if (isPublic !== undefined) itinerary.isPublic = isPublic;
        itinerary.updatedAt = Date.now();

        await itinerary.save();
        res.json(itinerary);
    } catch (error) {
        console.error('Error updating itinerary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        if (itinerary.user?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No access' });
        }

        await itinerary.deleteOne();
        res.json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
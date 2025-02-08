const express = require('express');
const router = express.Router();
const FoodLog = require('../models/FoodLog'); // Ensure you have a model

// Add food log entry
router.post('/log', async (req, res) => {
    try {
        const { food, quantity } = req.body;
        const newLog = new FoodLog({ food, quantity });
        await newLog.save();
        res.status(201).json({ message: 'Food logged successfully!', log: newLog });
    } catch (error) {
        console.error('Error logging food:', error);
        res.status(500).json({ error: 'Failed to log food' });
    }
});

module.exports = router;

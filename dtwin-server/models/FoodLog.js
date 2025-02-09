const mongoose = require('mongoose');

const FoodLogSchema = new mongoose.Schema({
    food: { type: String, required: true },
    quantity: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodLog', FoodLogSchema);

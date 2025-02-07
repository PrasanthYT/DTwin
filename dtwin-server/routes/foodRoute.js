const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

// Add food to user
router.post("/add", async (req, res) => {
  try {
    const { userId, name, calories, carbohydrates, protein, fat, quantity } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const newFood = new Food({
      userId,
      name,
      calories,
      carbohydrates,
      protein,
      fat,
      quantity,
    });

    await newFood.save();
    res.status(201).json({ message: "Food added successfully", food: newFood });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

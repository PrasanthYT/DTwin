const express = require("express");
const router = express.Router();
const { saveFitbitData, getFitbitData } = require("../controllers/fitbitController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Save Fitbit Data
router.post("/save", authMiddleware, saveFitbitData);

// ✅ Get Fitbit Data
router.get("/get", authMiddleware, getFitbitData);

module.exports = router;

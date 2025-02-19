const express = require("express");
const { saveGlucoseData, getGlucoseData } = require("../controllers/glucoseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Save glucose data
router.post("/save", authMiddleware, saveGlucoseData);

// ✅ Get glucose data for a user
router.get("/get", getGlucoseData);

module.exports = router;

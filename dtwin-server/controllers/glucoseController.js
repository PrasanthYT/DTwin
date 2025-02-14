const GlucoseData = require("../models/GlucoseData");

exports.saveGlucoseData = async (req, res) => {
  try {
    console.log("📥 Received Data:", JSON.stringify(req.body, null, 2));

    const { userId, glucoseRecords } = req.body;

    if (
      !userId ||
      !glucoseRecords ||
      !Array.isArray(glucoseRecords) ||
      glucoseRecords.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid input data - missing required fields" });
    }

    // ✅ Format records correctly for `insertMany`
    const formattedRecords = glucoseRecords.map((record) => ({
      userId,
      date: record.date,
      time: record.time,
      glucoseLevel: record.glucoseLevel,
      status: record.status,
    }));

    // ✅ Use `insertMany` to store multiple records at once
    await GlucoseData.insertMany(formattedRecords);

    console.log("✅ Glucose Data Saved!");
    res.status(201).json({ message: "Glucose data saved successfully" });
  } catch (error) {
    console.error("❌ Error saving glucose data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get glucose data for a user
exports.getGlucoseData = async (req, res) => {
    try {
      const { userId } = req.body; // ✅ Get userId from the request body
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      // ✅ Fetch glucose data for the user (sorted latest first)
      const glucoseData = await GlucoseData.find({ userId }).sort({ date: -1 });
  
      res.status(200).json({ success: true, data: glucoseData });
    } catch (error) {
      console.error("❌ Error fetching glucose data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
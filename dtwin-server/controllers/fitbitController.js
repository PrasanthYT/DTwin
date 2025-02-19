const FitbitData = require("../models/FitbitData");
const jwt = require("jsonwebtoken");

// ✅ Save or Update Fitbit Data
exports.saveFitbitData = async (req, res) => {
  try {
    // ✅ Extract JWT Token from Header
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(401)
        .json({ message: "Access denied: No token provided" });

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const userId = decoded.userId; // ✅ Extract userId from token

    const fitbitData = req.body;
    if (!fitbitData || !fitbitData.profile || !fitbitData.profile.user) {
      return res.status(400).json({ message: "Invalid Fitbit data received" });
    }

    // ✅ Create weekly data array
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const weeklyEntry = {
      date: today,
      activity: fitbitData.activity,
      sleep: fitbitData.sleep,
      heartRate: fitbitData.heartRate,
    };

    // ✅ Find and Update Existing Document
    const updatedData = await FitbitData.findOneAndUpdate(
      { userId }, // Find by `userId`
      {
        $set: { profile: fitbitData.profile.user }, // Update profile info
        $push: { weeklyData: weeklyEntry }, // Append weekly data
      },
      { upsert: true, new: true, useFindAndModify: false } // Create if not exists
    );

    console.log("✅ Fitbit Data Saved/Updated Successfully!");
    res.json({
      success: true,
      message: "Fitbit data saved successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("❌ Error Saving Fitbit Data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
};

// ✅ Get Fitbit Data for Authenticated User
exports.getFitbitData = async (req, res) => {
  try {
    // ✅ Extract JWT Token from Header
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(401)
        .json({ message: "Access denied: No token provided" });

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const userId = decoded.userId; // ✅ Extract userId from token

    const fitbitData = await FitbitData.findOne({ userId });

    if (!fitbitData) {
      return res.status(404).json({ message: "No Fitbit data found" });
    }

    res.status(200).json({ data: fitbitData });
  } catch (error) {
    console.error("❌ Error Fetching Fitbit Data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

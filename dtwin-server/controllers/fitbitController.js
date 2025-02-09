const FitbitData = require("../models/FitbitData");

// ✅ Save Fitbit Data
exports.saveFitbitData = async (req, res) => {
  try {
    const userId = req.user.userId; // Get from middleware
    const { profile, weeklyData } = req.body;

    // ✅ Check if data already exists
    let existingData = await FitbitData.findOne({ userId });

    if (existingData) {
      // ✅ Update existing Fitbit data
      existingData.profile = profile;
      existingData.weeklyData = weeklyData;
      await existingData.save();
      return res.status(200).json({ message: "Fitbit data updated successfully", data: existingData });
    }

    // ✅ Save new Fitbit data
    const newFitbitData = new FitbitData({ userId, profile, weeklyData });
    await newFitbitData.save();

    res.status(201).json({ message: "Fitbit data saved successfully", data: newFitbitData });
  } catch (error) {
    console.error("Error saving Fitbit data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Fitbit Data for Authenticated User
exports.getFitbitData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fitbitData = await FitbitData.findOne({ userId });

    if (!fitbitData) {
      return res.status(404).json({ message: "No Fitbit data found" });
    }

    res.status(200).json({ data: fitbitData });
  } catch (error) {
    console.error("Error fetching Fitbit data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

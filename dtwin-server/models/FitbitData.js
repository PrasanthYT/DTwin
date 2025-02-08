const mongoose = require("mongoose");

const FitbitDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Reference to user
  profile: {
    age: Number,
    ambassador: Boolean,
    autoStrideEnabled: Boolean,
    avatar: String,
    avatar150: String,
    // Add other profile fields as needed
  },
  weeklyData: [
    {
      date: String,
      activity: Object,
      heartRate: Object,
      sleep: Object,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("FitbitData", FitbitDataSchema);

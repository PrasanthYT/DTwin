const mongoose = require("mongoose");

const FitbitDataSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Reference to user (Not Unique)

    profile: {
      age: Number,
      ambassador: Boolean,
      autoStrideEnabled: Boolean,
      avatar: String,
      avatar150: String,
      displayName: String,
      gender: String,
      height: Number,
      weight: Number,
    },

    weeklyData: [
      {
        date: { type: String, required: true }, // ✅ Store date as `YYYY-MM-DD`
        activity: {
          caloriesOut: Number,
          steps: Number,
          distance: Number,
          floors: Number,
          activeMinutes: Number,
          summary: Object, // ✅ Store full summary
        },
        heartRate: [
          {
            dateTime: String,
            value: Object, // ✅ Store heart rate values
          },
        ],
        sleep: {
          sleepRecords: Array, // ✅ Store multiple sleep records
          summary: Object, // ✅ Store sleep summary
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FitbitData", FitbitDataSchema);

const mongoose = require("mongoose");

const glucoseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // User identifier
    date: { type: Date, required: true }, // Date of measurement
    time: { type: String, required: true }, // Time of measurement (HH:MM format)
    glucoseLevel: { type: Number, required: true }, // Glucose level in mmol/L
    status: { type: String, enum: ["In Range", "Out of Range"], required: true }, // Status
  },
  { timestamps: true } // Auto-create createdAt & updatedAt fields
);

const GlucoseData = mongoose.model("GlucoseData", glucoseSchema);
module.exports = GlucoseData;

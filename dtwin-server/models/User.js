const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: Number, unique: true },
  googleId: { type: String, unique: true, sparse: true },
  userDetails: {
    healthGoal: String,
    gender: String,
    weight: Number,
    age: Number,
    bloodGroup: String,
    fitnessLevel: String,
    sleepLevel: String,
    medications: [{ name: String, category: String }],
    symptoms: [String],
    avatar: String,
    healthInput: String,
    healthReport: String,
  },
  healthData: {
    healthScore: Number,
    scoreBreakdown: {
      fitness: Number,
      sleep: Number,
      nutrition: Number,
      symptoms: Number,
      medications: Number,
      lifestyle: Number,
      otherFactors: Number,
    },
    healthInsights: String,
    improvementSteps: [
      {
        id: Number,
        activity: String,
        text: String,
        completed: Boolean,
        target: String,
      },
    ],
  },
});

module.exports = mongoose.model("User", UserSchema);

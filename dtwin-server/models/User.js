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
    medications: [
      {
        name: String,
        category: String,
      },
    ],
    symptoms: [String],
    avatar: String,
  },
});

module.exports = mongoose.model("User", UserSchema);

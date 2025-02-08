const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
  protein: { type: Number, required: true },
//   fat: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 100 },
});

module.exports = mongoose.model("Food", FoodSchema);

const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  userId: { type: Number, ref: "User", required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
  protein: { type: Number, required: true },
  glycemicIndex:{ type: Number, required: true },
  glycemicLoad: { type: Number, required: true },
  fiber :{ type: Number, required: true },
  sugar: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 100 },
});

module.exports = mongoose.model("Food", FoodSchema);

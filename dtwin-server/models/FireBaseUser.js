const mongoose = require("mongoose");

const FireBaseUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  googleId: { type: String, unique: true },
});

module.exports = mongoose.model("FireBaseUser", FireBaseUserSchema);

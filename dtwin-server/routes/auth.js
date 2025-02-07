const express = require("express");
const { register, login, googleAuth, googleCallback, getFitData, googleSignup } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello from auth route");
});
router.post("/register", register);
router.post("/login", login);
router.post('/google-signup', googleSignup);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/fit-data", authMiddleware, getFitData);

module.exports = router;

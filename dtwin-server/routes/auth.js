const express = require("express");
const { register, login, googleAuth, googleCallback, getFitData, updateUserData, googleSignup, updateAvatar, storeHealthScore, getUser, updateUserMedications, removeUserMedication } = require("../controllers/authController");
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
router.post("/user-data", authMiddleware, updateUserData);
router.post("/user-avatar", authMiddleware, updateAvatar);
router.post("/user-health-score", authMiddleware, storeHealthScore);
router.get("/user", authMiddleware, getUser);
router.post("/update-medications", authMiddleware, updateUserMedications);
router.post("/remove-medication", authMiddleware, removeUserMedication);

module.exports = router;
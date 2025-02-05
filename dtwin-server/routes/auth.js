const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello from auth route");
});
router.post("/register", register);
router.post("/login", login);

module.exports = router;

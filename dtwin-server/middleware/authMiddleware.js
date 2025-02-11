const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET); // Remove 'Bearer ' prefix if present
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid token" });
  }
};

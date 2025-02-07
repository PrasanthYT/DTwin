const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Generate a 10-digit user ID
    const generateUserId = () => {
      return Math.floor(Math.random() * 9000000000) + 1000000000; // Generates a random 10-digit number
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = generateUserId();
    // Create new user
    user = new User({
      username,
      password: hashedPassword,
      userId: userId, // Assign generated user ID
    });

    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Step 1: Redirect user to Google OAuth
exports.googleAuth = (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.body.read",
    ],
  });
  res.redirect(authUrl);
};

// Step 2: Handle OAuth callback and fetch user profile
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    let user = await User.findOne({ googleId: userInfo.data.id });

    if (!user) {
      user = new User({
        username: userInfo.data.name,
        googleId: userInfo.data.id,
      });
      await user.save();
    }

    res.status(200).json({ message: "Google Fit Access Granted!", user });
  } catch (error) {
    res.status(500).json({ message: "OAuth Error", error });
  }
};

// Step 3: Fetch Google Fit data and store in DB
exports.getFitData = async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.user.googleId });
    if (!user) return res.status(404).json({ message: "User not found" });

    oAuth2Client.setCredentials(user.tokens);

    const response = await axios.post(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      {
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.calories.expended" },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        endTimeMillis: Date.now(),
      },
      { headers: { Authorization: `Bearer ${user.tokens.access_token}` } }
    );

    user.googleFitData = response.data;
    await user.save();

    res.json({ message: "Data saved successfully!", data: user.googleFitData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract token from headers

    const {
      healthGoal,
      gender,
      weight,
      age,
      bloodGroup,
      fitnessLevel,
      sleepLevel,
      medications,
      symptoms,
      avatar,
    } = req.body;

    // Find user by userId
    let user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update userDetails object
    user.userDetails = {
      healthGoal: healthGoal || user.userDetails?.healthGoal,
      gender: gender || user.userDetails?.gender,
      weight: weight || user.userDetails?.weight,
      age: age || user.userDetails?.age,
      bloodGroup: bloodGroup || user.userDetails?.bloodGroup,
      fitnessLevel: fitnessLevel || user.userDetails?.fitnessLevel,
      sleepLevel: sleepLevel || user.userDetails?.sleepLevel,
      medications: medications
        ? medications.map((med) => `${med.name} (${med.category})`) // Convert objects to strings
        : user.userDetails?.medications,
      symptoms: symptoms || user.userDetails?.symptoms,
      avatar: avatar || user.userDetails?.avatar,
    };

    await user.save();
    console.log("User data updated successfully");
    res.status(200).json({ message: "User data updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user data", error });
  }
};

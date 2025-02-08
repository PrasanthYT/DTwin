const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const FireBaseUser = require("../models/FireBaseUser");
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
    const userId = req.user?.userId; // Extract userId safely from the request

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    const {
      healthGoal,
      gender,
      weight,
      age,
      bloodGroup,
      fitnessLevel,
      sleepLevel,
      medications = [], // Ensure medications is always an array
      symptoms,
      avatar,
      healthInput,
      healthReport,
    } = req.body;

    // Find user by userId
    let user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(healthReport)
    // ✅ Ensure medications follow the correct schema (Array of Objects)
    const formattedMedications = Array.isArray(medications)
      ? medications
          .map((med) =>
            typeof med === "object" && med.name && med.category
              ? { name: med.name, category: med.category }
              : null
          )
          .filter(Boolean) // Removes invalid entries
      : user.userDetails?.medications || [];

    // ✅ Update userDetails while preserving existing values
    user.userDetails = {
      ...user.userDetails,
      healthGoal: healthGoal || user.userDetails?.healthGoal,
      gender: gender || user.userDetails?.gender,
      weight: weight || user.userDetails?.weight,
      age: age || user.userDetails?.age,
      bloodGroup: bloodGroup || user.userDetails?.bloodGroup,
      fitnessLevel: fitnessLevel || user.userDetails?.fitnessLevel,
      sleepLevel: sleepLevel || user.userDetails?.sleepLevel,
      medications: formattedMedications, // ✅ Correctly formatted medications
      symptoms: symptoms || user.userDetails?.symptoms,
      avatar: avatar || user.userDetails?.avatar,
      healthInput: healthInput || user.userDetails?.healthInput,
      healthReport: healthReport || user.userDetails?.healthReport,
    };

    await user.save();
    console.log("User data updated successfully");

    res.status(200).json({ message: "User data updated successfully", user });
  } catch (error) {
    console.error("Error updating user data:", error);
    res
      .status(500)
      .json({ message: "Error updating user data", error: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user?.userId; // Ensure userId is extracted
    const { avatar } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    if (!avatar) {
      return res.status(400).json({ message: "Avatar URL is required" });
    }

    // Update the avatar in the database
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: { "userDetails.avatar": avatar } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Avatar updated successfully", avatar });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.googleSignup = async (req, res) => {
  try {
    const { name, email, photoURL, uid } = req.body;

    // Check if the user already exists in the database
    let user = await FireBaseUser.findOne({ email });

    if (!user) {
      // Create new user
      user = new FireBaseUser({
        name,
        email,
        photoURL,
        googleId: uid,
      });

      await user.save();
    }

    res.status(200).json({ message: "User stored successfully", user });
  } catch (error) {
    console.error("Google Signup Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.storeHealthScore = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { healthScore, scoreBreakdown, healthInsights, improvementSteps } =
      req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Find user and update health data
    const user = await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          healthData: {
            healthScore,
            scoreBreakdown,
            healthInsights,
            improvementSteps,
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Health score updated successfully",
      healthData: user.healthData,
    });
  } catch (error) {
    console.error("Error storing health score:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.user?.userId; // Extract userId from middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Find user and exclude password
    const user = await User.findOne({ userId }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User data retrieved successfully");
    res.status(200).json({ message: "User data retrieved successfully", user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const axios = require("axios");
require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const foodRoute = require("./routes/foodRoute");
const authRoutes = require("./routes/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fitbit = require("./routes/fitbitRoute");
const foodLogRoute = require("./routes/foodLogRoute");
const session = require("express-session");
const glucoseRoutes = require("./routes/glucoseRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Allow frontend to access API
    credentials: true, // ✅ Allow cookies & session data
  })
);
// ✅ Increase request body size limit
app.use(bodyParser.json({ limit: "50mb" })); // Allows up to 50MB JSON payloads
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoute);
app.use("/api/fitbit", fitbit);
app.use("/api/foodlog", foodLogRoute);
app.use("/api/glucose", glucoseRoutes);
app.post("/api/speech/generate", async (req, res) => {
  try {
    const data = req.body;

    const response = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": "ap2_c545e50b-508b-42ee-92c6-86593dea28fb", // Your actual API key ap2_41728874-db7e-4f54-94d2-47a8c0dcf9dc
        },
      }
    );

    res.json(response.data); // Send the response back to the frontend
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send("Error generating speech");
  }
});
const CLARIFAI_API_KEY = "b4cab69c10254d71abf4219a2c86c350";

// Using Clarifai's general food model
const FOOD_MODEL_ID = "food-item-v1-recognition";

app.post("/api/identify-food", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || image.trim() === "") {
      return res.status(400).json({ error: "Invalid image data" });
    }

    const response = await fetch(
      `https://api.clarifai.com/v2/models/${FOOD_MODEL_ID}/outputs`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Key " + CLARIFAI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_app_id: {
            user_id: "clarifai",
            app_id: "main",
          },
          inputs: [
            {
              data: {
                image: {
                  base64: image,
                },
              },
            },
          ],
          model: {
            output_info: {
              output_config: {
                min_value: 0.5, // Only show predictions with >50% confidence
                max_concepts: 10, // Get more predictions
              },
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Fitbit Session Setup
app.use(
  session({
    secret: "fitbit_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set `true` if using HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ✅ Check if User is Authenticated
app.get("/api/fitbit/session", (req, res) => {
  res.json({ authenticated: !!req.session.access_token });
});

// ✅ Step 1: Redirect User to Fitbit OAuth
app.get("/auth/fitbit", (req, res) => {
  const authUrl = `${
    process.env.FITBIT_AUTH_URL
  }?response_type=code&client_id=${
    process.env.FITBIT_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.FITBIT_REDIRECT_URI
  )}&scope=activity%20heartrate%20sleep%20profile`;
  res.json({ authUrl });
});

// ✅ Step 2: Handle Fitbit OAuth Callback
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // ✅ Construct Basic Auth Header
    const credentials = Buffer.from(
      `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
    ).toString("base64");

    // ✅ Exchange Code for Access Token
    const response = await axios.post(
      process.env.FITBIT_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.FITBIT_CLIENT_ID,
        client_secret: process.env.FITBIT_CLIENT_SECRET, // ✅ Ensure Secret is Sent
        redirect_uri: process.env.FITBIT_REDIRECT_URI,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`, // ✅ Proper Basic Auth
        },
      }
    );

    const { access_token } = response.data;

    // ✅ Store access token in session
    req.session.access_token = access_token;
    console.log("✅ Fitbit Token Stored:", access_token);

    // ✅ Redirect to frontend
    res.redirect("http://localhost:5173/dashboard");
  } catch (error) {
    console.error("❌ Fitbit Auth Error:", error.response?.data || error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// ✅ Step 3: Get Fitbit Data (Weekly Summary)
app.get("/api/fitbit/data", async (req, res) => {
  const accessToken = req.session.access_token;
  if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    // ✅ Get Dates
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weekAgoStr = weekAgo.toISOString().split("T")[0];

    // ✅ Fetch Fitbit Data
    const [profile, sleep, activity, heartRate] = await Promise.all([
      axios.get(`${process.env.FITBIT_API_URL}profile.json`, config),
      axios.get(
        `${process.env.FITBIT_API_URL}sleep/date/${weekAgoStr}/${today}.json`,
        config
      ),
      axios.get(
        `${process.env.FITBIT_API_URL}activities/date/${today}.json`,
        config
      ),
      axios.get(
        `${process.env.FITBIT_API_URL}activities/heart/date/${weekAgoStr}/${today}.json`,
        config
      ),
    ]);

    res.json({
      profile: profile.data,
      sleep: sleep.data,
      activity: activity.data,
      heartRate: heartRate.data,
    });
  } catch (error) {
    console.error("❌ Fitbit Data Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const apiKey = "AIzaSyDo-YvanSAVyvuEZ7jwQpLoPG9NNwQOCSc";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `System Instruction for AI Wellness Data Processing
Objective:
The AI should analyze user data related to physical fitness, nutrition, and mental wellness, then provide structured recommendations for improvement in a predefined JSON format.

Input Format:
The AI will receive JSON input containing various wellness parameters such as:

Physical Fitness: Step count, calories burned, heart rate, weight, height, active time, workout details.
Nutrition: Daily intake values, macronutrient distribution, hydration levels, micronutrient status.
Mental Wellness: Sleep data, stress levels, mindfulness activities, mood tracking.
Output Format:
The AI must return:

Key Metrics Summary: A structured list of wellness-related metrics with icons, color coding, and units.
Five Steps for Improvement: Actionable, personalized suggestions based on the input data.
Analysis & Insights: A summary explaining key observations and areas for improvement.
Processing Rules:
Identify Patterns: The AI should detect trends from user data and suggest improvements accordingly.
Personalized Insights: Recommendations should be tailored based on user-specific metrics.
Holistic Approach: Ensure balance across physical fitness, nutrition, and mental wellness.
JSON Structure Compliance: The AI must return responses in the correct format.
Example Response Structure:
json
Copy
Edit
{
  "fitnessMetrics": [
    {
      "title": "Metric 1",
      "amount": "Value 1",
      "icon": "related emoji 1😊",
      "color": "Color 1",
      "textColor": "random TextColor 1",
      "unit": "Unit 1"
    },
    {
      "title": "Metric 2",
      "amount": "Value 2",
      "icon": "related emoji 😊2",
      "color": "Color 2",
      "textColor": "random TextColor 2",
      "unit": "Unit 2"
    },
    {
      "title": "Metric 3",
      "amount": "Value 3",
      "icon": "related emoji 😊3",
      "color": "Color 3",
      "textColor": "random TextColor 3",
      "unit": "Unit 3"
    }
  ],
  "improvementSteps": [
    {
      "id": 1,
      "activity": "Step 1",
      "text": "Description of step 1",
      "completed": false,
      "duration": "Duration 1",
      "target": "Target 1"
    },
    {
      "id": 2,
      "activity": "Step 2",
      "text": "Description of step 2",
      "completed": false,
      "duration": "Duration 2",
      "target": "Target 2"
    },
    {
      "id": 3,
      "activity": "Step 3",
      "text": "Description of step 3",
      "completed": false,
      "duration": "Duration 3",
      "target": "Target 3"
    },
    {
      "id": 4,
      "activity": "Step 4",
      "text": "Description of step 4",
      "completed": false,
      "duration": "Duration 4",
      "target": "Target 4"
    },
    {
      "id": 5,
      "activity": "Step 5",
      "text": "Description of step 5",
      "completed": false,
      "duration": "Duration 5",
      "target": "Target 5"
    }
  ],
  "analysis": "Summary of observations and areas for improvement."
}
Integration Guidelines:
AI should retrieve actual user data and process it accordingly.
Context-aware recommendations should be generated based on user-specific input.
Strict adherence to JSON format is required for seamless data processing`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post("/api/health-ai", async (req, res) => {
  console.log("hiiiii");
  try {
    const userInput = req.body.input;
    if (!userInput) {
      return res.status(400).json({ error: "Input is required." });
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(userInput);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request." });
  }
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () =>
  console.log(`Server running on  http:/localhost:${PORT}`)
);

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

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoute);
app.use("/api/fitbit", fitbit);
app.use("/api/foodlog", foodLogRoute);
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
          "api-key": "ap2_0a38b083-a38b-47bc-ab3c-dced8318def0", // Your actual API key ap2_41728874-db7e-4f54-94d2-47a8c0dcf9dc
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

app.post("/api/");

const FITBIT_CLIENT_ID = "23Q6D5";
const FITBIT_CLIENT_SECRET = "d1e772601b8a9473f3717b6f2cfb307e";
const REDIRECT_URI = "http://localhost:5173/Fitbit";

// Helper function to get date string for n days ago
const getDateString = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Helper function to handle errors
const handleError = (error, res) => {
  console.error("Error details:", {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  });

  const status = error.response?.status || 500;
  const message = error.response?.data?.errors?.[0]?.message || error.message;

  res.status(status).json({
    error: message,
    details: error.response?.data,
  });
};

app.get("/auth", (req, res) => {
  const scopes = [
    "activity",
    "nutrition",
    "heartrate",
    "location",
    "profile",
    "settings",
    "sleep",
    "social",
    "weight",
  ].join("%20");

  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scopes}`;
  res.json({ authUrl });
});

app.post("/token", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", REDIRECT_URI);

    const tokenResponse = await axios.post(
      "https://api.fitbit.com/oauth2/token",
      params,
      {
        auth: {
          username: FITBIT_CLIENT_ID,
          password: FITBIT_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(tokenResponse.data);
  } catch (error) {
    handleError(error, res);
  }
});

app.get("/fitbit-data", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const today = getDateString(0);
    const weekAgo = getDateString(6);

    // Fetch all required data
    const [
      profileResponse,
      sleepResponse,
      activityResponse,
      heartRateResponse,
    ] = await Promise.all([
      // Profile data
      axios.get("https://api.fitbit.com/1/user/-/profile.json", config),

      // Sleep data for the week
      axios.get(
        `https://api.fitbit.com/1.2/user/-/sleep/date/${weekAgo}/${today}.json`,
        config
      ),

      // Activity data for the week
      Promise.all(
        Array.from({ length: 7 }, (_, i) =>
          axios.get(
            `https://api.fitbit.com/1/user/-/activities/date/${getDateString(
              i
            )}.json`,
            config
          )
        )
      ),

      // Heart rate data for the week
      Promise.all(
        Array.from({ length: 7 }, (_, i) =>
          axios.get(
            `https://api.fitbit.com/1/user/-/activities/heart/date/${getDateString(
              i
            )}/1d.json`,
            config
          )
        )
      ),
    ]);

    // Process weekly data
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = getDateString(6 - i);
      return {
        date,
        activity: activityResponse[6 - i].data,
        heartRate: heartRateResponse[6 - i].data,
        sleep:
          sleepResponse.data.sleep.filter((s) => s.dateOfSleep === date)[0] ||
          null,
      };
    });

    res.json({
      profile: profileResponse.data,
      weeklyData,
    });
  } catch (error) {
    handleError(error, res);
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

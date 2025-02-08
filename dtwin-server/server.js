const axios = require('axios')
require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const foodRoute = require("./routes/foodRoute");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoute);
app.post("/api/speech/generate", async (req, res) => {
  try {
    const data = req.body;
    
    const response = await axios.post("https://api.murf.ai/v1/speech/generate", data, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "api-key": "ap2_0a38b083-a38b-47bc-ab3c-dced8318def0",  // Your actual API key
      },
    });

    res.json(response.data);  // Send the response back to the frontend
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send("Error generating speech");
  }
});
const CLARIFAI_API_KEY = 'b4cab69c10254d71abf4219a2c86c350';

// Using Clarifai's general food model
const FOOD_MODEL_ID = 'food-item-v1-recognition';

app.post('/api/identify-food', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image || image.trim() === '') {
            return res.status(400).json({ error: 'Invalid image data' });
        }

        const response = await fetch(
            `https://api.clarifai.com/v2/models/${FOOD_MODEL_ID}/outputs`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Key ' + CLARIFAI_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "user_app_id": {
                        "user_id": "clarifai",
                        "app_id": "main"
                    },
                    "inputs": [
                        {
                            "data": {
                                "image": {
                                    "base64": image
                                }
                            }
                        }
                    ],
                    "model": {
                        "output_info": {
                            "output_config": {
                                "min_value": 0.50,  // Only show predictions with >50% confidence
                                "max_concepts": 10  // Get more predictions
                            }
                        }
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
});

app.post("/api/")


const FITBIT_CLIENT_ID = '23Q73T';
const FITBIT_CLIENT_SECRET = 'fab427a2e8bf27a9df931327d5b11ca0';
const REDIRECT_URI = 'http://localhost:5173/Fitbit';

// Helper function to get date string for n days ago
const getDateString = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Helper function to handle errors
const handleError = (error, res) => {
  console.error('Error details:', {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status
  });
  
  const status = error.response?.status || 500;
  const message = error.response?.data?.errors?.[0]?.message || error.message;
  
  res.status(status).json({
    error: message,
    details: error.response?.data
  });
};

app.get('/auth', (req, res) => {
  const scopes = [
    'activity',
    'nutrition',
    'heartrate',
    'location',
    'profile',
    'settings',
    'sleep',
    'social',
    'weight'
  ].join('%20');
  
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes}`;
  res.json({ authUrl });
});

app.post('/token', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', REDIRECT_URI);
    
    const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token', 
      params,
      {
        auth: {
          username: FITBIT_CLIENT_ID,
          password: FITBIT_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    res.json(tokenResponse.data);
  } catch (error) {
    handleError(error, res);
  }
});

app.get('/fitbit-data', async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const today = getDateString(0);
    const weekAgo = getDateString(6);
    
    // Fetch all required data
    const [
      profileResponse,
      sleepResponse,
      activityResponse,
      heartRateResponse
    ] = await Promise.all([
      // Profile data
      axios.get('https://api.fitbit.com/1/user/-/profile.json', config),
      
      // Sleep data for the week
      axios.get(`https://api.fitbit.com/1.2/user/-/sleep/date/${weekAgo}/${today}.json`, config),
      
      // Activity data for the week
      Promise.all(
        Array.from({ length: 7 }, (_, i) => 
          axios.get(`https://api.fitbit.com/1/user/-/activities/date/${getDateString(i)}.json`, config)
        )
      ),
      
      // Heart rate data for the week
      Promise.all(
        Array.from({ length: 7 }, (_, i) =>
          axios.get(`https://api.fitbit.com/1/user/-/activities/heart/date/${getDateString(i)}/1d.json`, config)
        )
      )
    ]);

    // Process weekly data
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = getDateString(6 - i);
      return {
        date,
        activity: activityResponse[6 - i].data,
        heartRate: heartRateResponse[6 - i].data,
        sleep: sleepResponse.data.sleep.filter(s => s.dateOfSleep === date)[0] || null
      };
    });

    res.json({
      profile: profileResponse.data,
      weeklyData
    });
  } catch (error) {
    handleError(error, res);
  }
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Server running on  http:/localhost:${PORT}`));

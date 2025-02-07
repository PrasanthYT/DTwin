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

// Start Server
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Server running on  http:/localhost:${PORT}`));

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

app.post("/api/")

// Start Server
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Server running on  http:/localhost:${PORT}`));

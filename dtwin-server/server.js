require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(limiter);

// Fitbit Configuration
const CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;
const REDIRECT_URI = process.env.FITBIT_REDIRECT_URI;

// Fitbit User Schema
const FitbitUserSchema = new mongoose.Schema({
    userId: String,
    accessToken: String,
    refreshToken: String,
    tokenExpiry: Date,
    lastUpdated: { type: Date, default: Date.now }
});

const FitbitUser = mongoose.model('FitbitUser', FitbitUserSchema);

// Fitbit Routes

// Token exchange endpoint
app.post('/api/fitbit/token', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code is required' });
        }

        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://api.fitbit.com/oauth2/token',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams({
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI
            })
        });

        // Store tokens in MongoDB
        const fitbitUser = new FitbitUser({
            userId: tokenResponse.data.user_id,
            accessToken: tokenResponse.data.access_token,
            refreshToken: tokenResponse.data.refresh_token,
            tokenExpiry: new Date(Date.now() + tokenResponse.data.expires_in * 1000)
        });
        await fitbitUser.save();

        res.json({
            access_token: tokenResponse.data.access_token,
            expires_in: tokenResponse.data.expires_in,
            userId: tokenResponse.data.user_id
        });

    } catch (error) {
        console.error('Token exchange error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to exchange token',
            details: error.response?.data || error.message
        });
    }
});

// Token refresh endpoint
app.post('/api/fitbit/refresh', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await FitbitUser.findOne({ userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://api.fitbit.com/oauth2/token',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams({
                refresh_token: user.refreshToken,
                grant_type: 'refresh_token'
            })
        });

        // Update stored tokens
        user.accessToken = tokenResponse.data.access_token;
        user.refreshToken = tokenResponse.data.refresh_token;
        user.tokenExpiry = new Date(Date.now() + tokenResponse.data.expires_in * 1000);
        user.lastUpdated = new Date();
        await user.save();

        res.json({
            access_token: tokenResponse.data.access_token,
            expires_in: tokenResponse.data.expires_in
        });

    } catch (error) {
        console.error('Token refresh error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to refresh token',
            details: error.response?.data || error.message
        });
    }
});

// Create a cache middleware
const cache = new Map();
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = req.originalUrl + JSON.stringify(req.body);
        const cachedResponse = cache.get(key);

        if (cachedResponse && Date.now() - cachedResponse.time < duration * 1000) {
            return res.json(cachedResponse.data);
        }

        res.originalJson = res.json;
        res.json = (data) => {
            cache.set(key, {
                data,
                time: Date.now()
            });
            res.originalJson(data);
        };
        next();
    };
};

// Proxy endpoint for Fitbit API requests
app.post('/api/fitbit/proxy', cacheMiddleware(300), async (req, res) => {
    try {
        const { endpoint, method = 'GET', body } = req.body;
        const userId = req.headers['x-user-id'];

        const user = await FitbitUser.findOne({ userId });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Check if token needs refresh
        if (new Date() >= user.tokenExpiry) {
            try {
                const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
                const tokenResponse = await axios({
                    method: 'post',
                    url: 'https://api.fitbit.com/oauth2/token',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: new URLSearchParams({
                        refresh_token: user.refreshToken,
                        grant_type: 'refresh_token'
                    })
                });

                user.accessToken = tokenResponse.data.access_token;
                user.refreshToken = tokenResponse.data.refresh_token;
                user.tokenExpiry = new Date(Date.now() + tokenResponse.data.expires_in * 1000);
                await user.save();
            } catch (error) {
                return res.status(401).json({ error: 'Token refresh failed' });
            }
        }

        const response = await axios({
            method,
            url: `https://api.fitbit.com/${endpoint}`,
            headers: {
                'Authorization': `Bearer ${user.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: body
        });

        res.json(response.data);

    } catch (error) {
        console.error('Proxy error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to proxy request',
            details: error.response?.data || error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Existing routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
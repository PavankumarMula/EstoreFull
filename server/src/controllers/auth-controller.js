// generate access token and refresh token store refresh token in redis
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const bcrypt = require('bcrypt');

const User = require("../models/user-model");

const generateTokens = async (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // store refresh token in redis with user id as key
    await redisClient.set(user._id.toString(), refreshToken, {
        EX: 7 * 24 * 60 * 60, // expire in 7 days
    });

    return { accessToken, refreshToken };
}
// remove cookies use normal flow 
const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const tokens = await generateTokens(user);
        res.status(200).json({ message: "Signed in successfully", tokens });
    } catch (error) {
        console.error("Error signing in", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// refresh token endpoint to generate new access token using refresh token also generate new refresh token and store in redis and invalidate old refresh token
const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.id;
        const storedRefreshToken = await redisClient.get(userId.toString());
        if (storedRefreshToken !== refreshToken) {
            return res.status(400).json({ message: "Invalid refresh token" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const tokens = await generateTokens(user);
        res.status(200).json({ message: "Token refreshed successfully", tokens });
    } catch (error) {
        console.error("Error refreshing token", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// logout endpoint to invalidate refresh token in redis
const logout = async (req, res) => {
    const userId = req.user.id;
    try {
        await redisClient.del(userId.toString());
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error logging out", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getCurrentUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching current user", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = { signIn, refreshToken, logout, getCurrentUser};
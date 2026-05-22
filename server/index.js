const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const redisClient = require('./src/config/redis');

app.use(cookieParser());

const connectDB = require('./src/config/db');

// routes
const userRoutes = require('./src/routes/user');
const authRoutes = require('./src/routes/auth-route');
const productRoutes = require('./src/routes/product-route');
const categoryRoutes = require('./src/routes/category-route');
const cartRoutes = require('./src/routes/cart-route');
const authMiddleware = require("./src/middlewares/auth-middleware");

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
// add middle ware
app.use("/api/cart", authMiddleware, cartRoutes);

const PORT = process.env.PORT || 5000;

// server configuration
const startServer = async () => {
    try {
        await connectDB();
        await redisClient.connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

startServer();

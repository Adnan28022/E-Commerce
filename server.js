require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Connect DB
connectDB();

// EXPORT app for Vercel — NO app.listen()
module.exports = app;

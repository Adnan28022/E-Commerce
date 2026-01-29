require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const connectDB = require("./config/db");

const app = express();

/* ===============================
   ENSURE UPLOAD DIRECTORIES
================================ */
const uploadDir = path.join(__dirname, "uploads");
const storeUploadDir = path.join(uploadDir, "stores");
const productUploadDir = path.join(uploadDir, "products");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(storeUploadDir)) fs.mkdirSync(storeUploadDir, { recursive: true });
if (!fs.existsSync(productUploadDir)) fs.mkdirSync(productUploadDir, { recursive: true });

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(uploadDir));

/* ===============================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

/* ===============================
   SERVE FRONTEND (React/Vue/Any)
================================ */
const frontendPath = path.join(__dirname, "dist");
app.use(express.static(frontendPath));

// Handle SPA routing: for any route not starting with /api, serve index.html
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===============================
   ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );
    })
    .catch((err) => {
        console.error("❌ DB Connection Failed:", err);
        process.exit(1);
    });

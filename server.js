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
   DB CONNECT (SAFE FOR VERCEL)
================================ */
connectDB().catch(err => {
    console.error("❌ DB Connection Failed:", err.message);
});

/* ===============================
   UPLOAD DIRS (LOCAL DEV SAFE)
   ⚠️ Vercel pe permanent nahi
================================ */
const uploadDir = path.join("/tmp", "uploads");
const storeUploadDir = path.join(uploadDir, "stores");
const productUploadDir = path.join(uploadDir, "products");

[uploadDir, storeUploadDir, productUploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(uploadDir));

/* ===============================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

/* ===============================
   FRONTEND (OPTIONAL)
================================ */
const frontendPath = path.join(__dirname, "dist");
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

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
   EXPORT FOR VERCEL
================================ */
module.exports = app;

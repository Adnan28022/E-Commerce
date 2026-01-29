// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");

// const authRoutes = require("./routes/authRoutes");
// const storeRoutes = require("./routes/storeRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");
// const productRoutes = require("./routes/productRoutes");

// const connectDB = require("./config/db");

// const app = express();

// const uploadDir = path.join(__dirname, "uploads");
// const storeUploadDir = path.join(uploadDir, "stores");
// const productUploadDir = path.join(uploadDir, "products");

// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// if (!fs.existsSync(storeUploadDir)) fs.mkdirSync(storeUploadDir, { recursive: true });
// if (!fs.existsSync(productUploadDir)) fs.mkdirSync(productUploadDir, { recursive: true });

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/uploads", express.static(uploadDir));

// app.use("/api/auth", authRoutes);
// app.use("/api/store", storeRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/products", productRoutes);

// const frontendPath = path.join(__dirname, "dist");
// app.use(express.static(frontendPath));

// app.get(/^\/(?!api).*/, (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
// });

// app.use((err, req, res, next) => {
//     console.error("🔥 Error:", err);
//     res.status(err.status || 500).json({
//         success: false,
//         message: err.message || "Internal Server Error",
//     });
// });

// const PORT = process.env.PORT || 5000;

// connectDB()
//     .then(() => {
//         app.listen(PORT, () =>
//             console.log(`🚀 Server running on port ${PORT}`)
//         );
//     })
//     .catch((err) => {
//         console.error("❌ DB Connection Failed:", err);
//         process.exit(1);
//     });



require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const connectDB = require("./config/db");

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

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
   DB CONNECT & EXPORT
================================ */
connectDB();
module.exports = app;

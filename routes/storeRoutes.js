const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const storeController = require("../controllers/storeController");

/* ================= MULTER SETUP ================= */

// ensure folder exists
const uploadPath = path.join(__dirname, "..", "uploads", "stores");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});

// file filter (images only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* =================================================
   SELLER ROUTES
================================================= */

/**
 * CREATE STORE
 * Customer → Seller
 */
router.post(
    "/create",
    authMiddleware,
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    storeController.createStore
);

/**
 * UPDATE STORE (seller only)
 */
router.put(
    "/update/:id",
    authMiddleware,
    roleMiddleware("seller"),
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    storeController.updateStore
);

/**
 * GET LOGGED-IN SELLER STORE
 */
router.get(
    "/my-store",
    authMiddleware,
    roleMiddleware("seller"),
    storeController.getMyStore
);

/* =================================================
   ADMIN ROUTES
================================================= */

/**
 * GET ALL STORES (Admin Panel)
 */
router.get(
    "/all",
    authMiddleware,
    roleMiddleware("admin"),
    storeController.getAllStores
);

module.exports = router;

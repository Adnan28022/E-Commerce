const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {updateProfile } = require("../controllers/authController");
// Multer setup for profile picture
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Public routes
router.post("/register", upload.single("profilePicture"), authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout); // optional
router.post("/update-profile", authMiddleware, upload.single("profilePicture"), updateProfile);
// Example protected route
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: `Welcome ${req.user.role}!`, user: req.user });
});

// Admin-only route
router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.json({ message: "Admin dashboard" });
});

module.exports = router;

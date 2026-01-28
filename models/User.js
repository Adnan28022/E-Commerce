const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    profilePicture: { type: String }, // Uploaded file path
    role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

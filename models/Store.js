// models/Store.js
const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    storeName: { type: String, required: true },
    storeSlug: { type: String, required: true, unique: true },

    logo: String,
    banner: String,

    description: String,
    phone: String,
    address: String,

}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);

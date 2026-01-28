// controllers/storeController.js
const Store = require("../models/Store");
const User = require("../models/User");

/* ================= CREATE STORE ================= */
exports.createStore = async (req, res) => {
    try {
        const alreadyStore = await Store.findOne({ owner: req.user.id });
        if (alreadyStore) {
            return res.status(400).json({
                message: "Store already exists, use update instead",
            });
        }

        const store = await Store.create({
            owner: req.user.id,
            storeName: req.body.storeName,
            storeSlug: req.body.storeSlug,
            description: req.body.description,
            phone: req.body.phone,
            address: req.body.address,
            logo: req.files?.logo?.[0]?.filename,
            banner: req.files?.banner?.[0]?.filename,
        });

        // 🔑 Promote to seller if not already
        await User.findByIdAndUpdate(req.user.id, { role: "seller" });

        res.status(201).json({
            message: "Store created successfully",
            store,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET MY STORE ================= */
exports.getMyStore = async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user.id });
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= UPDATE STORE ================= */
exports.updateStore = async (req, res) => {
    try {
        const updateData = {
            storeName: req.body.storeName,
            storeSlug: req.body.storeSlug,
            description: req.body.description,
            phone: req.body.phone,
            address: req.body.address,
        };

        if (req.files?.logo) {
            updateData.logo = req.files.logo[0].filename;
        }
        if (req.files?.banner) {
            updateData.banner = req.files.banner[0].filename;
        }

        const store = await Store.findOneAndUpdate(
            { owner: req.user.id },
            updateData,
            { new: true }
        );

        if (!store) {
            return res.status(404).json({
                message: "Store not found, create store first",
            });
        }

        res.json({
            message: "Store updated successfully",
            store,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET ALL STORES (ADMIN) ================= */
exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find()
            .populate("owner", "name email role")
            .sort({ createdAt: -1 });

        res.json({
            total: stores.length,
            stores,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

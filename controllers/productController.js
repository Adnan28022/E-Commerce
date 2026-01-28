const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
    try {
        const data = req.body;

        // Handle thumbnail & images if uploaded
        if (req.files?.thumbnail) data.thumbnail = req.files.thumbnail[0].filename;
        if (req.files?.images) data.images = req.files.images.map(f => f.filename);

        // Convert JSON strings to objects (if sent as multipart/form-data)
        ['variations', 'attributes', 'inventory', 'shipping', 'affiliate', 'groupedProducts'].forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                data[field] = JSON.parse(data[field]);
            }
        });

        const product = new Product(data);
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const data = req.body;

        // Handle uploaded files
        if (req.files?.thumbnail) data.thumbnail = req.files.thumbnail[0].filename;
        if (req.files?.images) data.images = req.files.images.map(f => f.filename);

        ['variations', 'attributes', 'inventory', 'shipping', 'affiliate', 'groupedProducts'].forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                data[field] = JSON.parse(data[field]);
            }
        });

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!updatedProduct) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product: updatedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        // Optionally remove images from server
        if (product.thumbnail) fs.unlinkSync(path.join(__dirname, '../uploads/', product.thumbnail));
        if (product.images?.length) product.images.forEach(img => fs.unlinkSync(path.join(__dirname, '../uploads/', img)));

        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

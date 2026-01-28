const Category = require("../models/Category");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Category name is required" });

        const exists = await Category.findOne({ name });
        if (exists) return res.status(400).json({ success: false, message: "Category already exists" });

        const category = await Category.create({ name, subCategories: [] });
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET CATEGORY BY ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ADD SUBCATEGORY
exports.addSubCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Subcategory name is required" });

        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });

        category.subCategories.push({ name, attributes: [] });
        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET SUBCATEGORIES
exports.getSubCategories = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });
        res.json({ success: true, data: category.subCategories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE SUBCATEGORY
exports.updateSubCategory = async (req, res) => {
    try {
        const { categoryId, subId } = req.params;
        const { name } = req.body;

        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });

        const sub = category.subCategories.id(subId);
        if (!sub) return res.status(404).json({ success: false, message: "Subcategory not found" });

        sub.name = name;
        await category.save();
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE SUBCATEGORY
exports.deleteSubCategory = async (req, res) => {
    try {
        const { categoryId, subId } = req.params;

        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });

        category.subCategories.id(subId).remove();
        await category.save();
        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

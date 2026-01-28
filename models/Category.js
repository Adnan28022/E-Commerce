const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    values: [{ type: String }]
});

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    attributes: [attributeSchema]
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subCategories: [subCategorySchema]
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);

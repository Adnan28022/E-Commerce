const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// CATEGORY CRUD
router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

// SUBCATEGORY CRUD
router.post("/:categoryId/subcategories", categoryController.addSubCategory);
router.get("/:categoryId/subcategories", categoryController.getSubCategories);
router.put("/:categoryId/subcategories/:subId", categoryController.updateSubCategory);
router.delete("/:categoryId/subcategories/:subId", categoryController.deleteSubCategory);

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the folder exists
const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
router.post(
    '/',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]),
    productController.createProduct
);

router.get('/', productController.getProducts);

router.get('/:id', productController.getProduct);

router.put(
    '/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]),
    productController.updateProduct
);

router.delete('/:id', productController.deleteProduct);

module.exports = router;

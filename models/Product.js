const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
    attributes: { type: Map, of: String }, // e.g. { Size: "M", Color: "Red" }
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sku: { type: String },
    image: { type: String } // store image filename
}, { _id: false });

const productSchema = new mongoose.Schema({
    sellerId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['simple', 'variable', 'grouped', 'affiliate'], default: 'simple' },
    price: { type: Number, default: 0 }, // default price for simple product
    category: { type: String, required: true },
    subCategory: { type: String },
    brand: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    thumbnail: { type: String }, // main image
    images: [{ type: String }], // gallery images

    attributes: [{ name: String, values: [String] }],
    variations: [variationSchema],

    inventory: {
        sku: { type: String },
        stock: { type: Number, default: 0 }
    },

    shipping: {
        weight: { type: Number },
        dimensions: {
            length: { type: Number },
            width: { type: Number },
            height: { type: Number }
        },
        method: { type: String, default: 'standard' },
        cost: { type: Number, default: 0 }
    },

    groupedProducts: [{ type: String }],
    affiliate: {
        url: { type: String },
        buttonText: { type: String },
        commissionPercent: { type: Number }
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

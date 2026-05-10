const mongoose = require("mongoose");


// ======================================
// CATEGORY SCHEMA
// ======================================

const categorySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
    },
    {
      timestamps: true,
    }
  );


// ======================================
// PRODUCT SCHEMA
// ======================================

const productSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      category: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Category",

        required: true,

        index: true,
      },

      brand: {
        type: String,
        required: true,
        trim: true,
      },

      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      thumbnail: {
        type: String,
        required: true,
      },

      images: [
        {
          type: String,
        },
      ],

      rating: {
        type: Number,
        default: 0,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );


// ======================================
// INDEXES
// ======================================

productSchema.index({
  title: "text",
  description: "text",
  brand: "text",
});


// ======================================
// MODELS
// ======================================

const Product = mongoose.model(
  "Product",
  productSchema
);

const Category = mongoose.model(
  "Category",
  categorySchema
);

module.exports = {
  Product,
  Category,
};
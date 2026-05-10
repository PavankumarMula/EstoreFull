
require("dotenv").config({
  path: __dirname + "/../.env",
});

const mongoose = require("mongoose");
const axios = require("axios");
const connectDB = require("../src/config/db");
const {Product,Category} = require("../src/models/product-model");










// ======================================
// SEED PRODUCTS
// ======================================

const seedProducts = async () => {

  try {

    await connectDB();

    // ======================================
    // FETCH PRODUCTS
    // ======================================

    const response =
      await axios.get(
        "https://dummyjson.com/products?limit=0"
      );

    const dummyProducts =
      response.data.products;

    console.log(
      `Fetched ${dummyProducts.length} products`
    );



    // ======================================
    // CLEAR OLD DATA
    // ======================================

    await Product.deleteMany();

    await Category.deleteMany();

    console.log(
      "Old Products & Categories Removed"
    );



    // ======================================
    // CREATE UNIQUE CATEGORIES
    // ======================================

    const uniqueCategories =
      [
        ...new Set(
          dummyProducts.map(
            (product) =>
              product.category
          )
        ),
      ];

    console.log(
      "Unique Categories:",
      uniqueCategories
    );


    // CATEGORY MAP
    // {
    //   beauty: ObjectId(...)
    // }

    const categoryMap = {};


    for (const categoryName of uniqueCategories) {

      const category =
        await Category.create({
          name: categoryName,
        });

      categoryMap[categoryName] =
        category._id;
    }

    console.log(
      "Categories Created"
    );



    // ======================================
    // MAP PRODUCTS
    // ======================================

    const transformedProducts =
      dummyProducts.map(
        (product) => {

          return {

            title: product.title,

            description:
              product.description,

            price: product.price,

            category:
              categoryMap[
                product.category
              ],

            brand:
              product.brand ||
              "Unknown Brand",

            stock:
              product.stock,

            thumbnail:
              product.thumbnail,

            images:
              product.images || [],

            rating:
              product.rating || 0,

            isActive: true,
          };
        }
      );



    // ======================================
    // INSERT PRODUCTS
    // ======================================

    await Product.insertMany(
      transformedProducts
    );

    console.log(
      `${transformedProducts.length} Products Inserted`
    );

    console.log(
      "Seeding Completed Successfully"
    );

    process.exit();

  } catch (error) {

    console.error(
      "Seeder Error",
      error
    );

    process.exit(1);
  }
};


seedProducts();
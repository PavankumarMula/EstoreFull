const {Product,Category} = require("../models/product-model");


// create a product
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      brand,
      stock,
      thumbnail,
      images,
      rating,
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      brand,
      stock,
      thumbnail,
      images,
      rating,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }       

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};




const getAllProducts = async (
  req,
  res
) => {

  try {

    // =====================================
    // QUERY PARAMS
    // =====================================

    const page =
      Math.max(
        Number(req.query.page) || 1,
        1
      );

    const limit =
      Math.max(
        Number(req.query.limit) || 12,
        1
      );

    const search =
      req.query.search || "";

    const category =
      req.query.category || "";

    const maxPrice =
      Number(req.query.maxPrice) || 5000;

    const sort =
      req.query.sort || "newest";

    const inStock =
      req.query.inStock === "true";


    // =====================================
    // SKIP
    // =====================================

    const skip =
      (page - 1) * limit;


    // =====================================
    // FILTER QUERY
    // =====================================

    const query = {};


    // SEARCH

    if (search) {

      query.$text = {
        $search: search,
      };
    }


    // CATEGORY

    if (category) {

      const categoryDoc =
        await Category.findOne({
          name: category,
        });

      if (categoryDoc) {

        query.category =
          categoryDoc._id;
      }
    }


    // PRICE

    query.price = {
      $lte: maxPrice,
    };


    // STOCK

    if (inStock) {

      query.stock = {
        $gt: 0,
      };
    }


    // =====================================
    // SORT OPTIONS
    // =====================================

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "price_asc") {

      sortOption = {
        price: 1,
      };
    }

    if (sort === "price_desc") {

      sortOption = {
        price: -1,
      };
    }

    if (sort === "rating") {

      sortOption = {
        rating: -1,
      };
    }


    // =====================================
    // TOTAL PRODUCTS
    // =====================================

    const totalProducts =
      await Product.countDocuments(
        query
      );


    // =====================================
    // PRODUCTS
    // =====================================

    const products =
      await Product.find(query)
        .populate(
          "category",
          "name"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limit);


    // =====================================
    // PAGINATION
    // =====================================

    const totalPages =
      Math.ceil(
        totalProducts / limit
      );


    return res.status(200).json({

      products,

      pagination: {

        totalProducts,

        totalPages,

        currentPage: page,

        limit,

        hasNextPage:
          page < totalPages,

        hasPrevPage:
          page > 1,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getAllProducts,
};

// get product by id

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch product from the database by ID (replace with actual DB query)
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
};
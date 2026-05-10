const {
  Category,
} = require(
  "../models/product-model"
);


// ======================================
// GET CATEGORIES
// ======================================

const getCategories = async (
  req,
  res
) => {

  try {

    const categories =
      await Category.find({})
        .sort({
          name: 1,
        });

    return res.status(200).json({
      categories,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getCategories,
};
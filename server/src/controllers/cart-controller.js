const Cart = require("../models/cart-model");
const {Product} = require("../models/product-model");


// =====================================
// ADD TO CART
// =====================================

const addToCart = async (
  req,
  res
) => {

  try {

    const userId = req.user.id;
    console.log("User ID from auth middleware:", userId);

    const {
      productId,
      quantity = 1,
    } = req.body;


    // =====================================
    // VALIDATE PRODUCT ID
    // =====================================

    if (!productId) {

      return res.status(400).json({
        message: "Product id is required",
      });
    }
    // =====================================
    // VALIDATE QUANTITY
    // =====================================
    if (quantity < 1) {

      return res.status(400).json({
        message:
          "Quantity must be greater than 0",
      });
    }


    // =====================================
    // FIND PRODUCT
    // =====================================

    const product =
      await Product.findById(productId);

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });
    }


    // =====================================
    // CHECK PRODUCT ACTIVE
    // =====================================

    if (!product.isActive) {

      return res.status(400).json({
        message:
          "Product is not available",
      });
    }


    // =====================================
    // CHECK STOCK
    // =====================================

    if (quantity > product.stock) {

      return res.status(400).json({
        message:
          `Only ${product.stock} items available in stock`,
      });
    }


    // =====================================
    // FIND USER CART
    // =====================================

    let cart =
      await Cart.findOne({
        user: userId,
      });


    // =====================================
    // CREATE NEW CART
    // =====================================

    if (!cart) {

      cart = await Cart.create({

        user: userId,

        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });

      return res.status(201).json({
        message:
          "Product added to cart",

        cart,
      });
    }


    // =====================================
    // CHECK EXISTING PRODUCT
    // =====================================

    const existingItem =
      cart.items.find(
        (item) =>
          item.product.toString() ===
          productId
      );


    // =====================================
    // PRODUCT ALREADY EXISTS
    // =====================================

    if (existingItem) {

      const totalQuantity =
        existingItem.quantity +
        quantity;


      // =====================================
      // VALIDATE TOTAL STOCK
      // =====================================

      if (
        totalQuantity > product.stock
      ) {

        return res.status(400).json({
          message:
            `Only ${product.stock} items available in stock`,
        });
      }


      // =====================================
      // UPDATE QUANTITY
      // =====================================

      existingItem.quantity =
        totalQuantity;
    }


    // =====================================
    // NEW PRODUCT
    // =====================================

    else {

      cart.items.push({
        product: productId,
        quantity,
      });
    }


    // =====================================
    // SAVE CART
    // =====================================

    await cart.save();


    // =====================================
    // POPULATE PRODUCTS
    // =====================================

    await cart.populate({
      path: "items.product",
      populate: {
        path: "category",
        select: "name",
      },
    });


    return res.status(200).json({

      message:
        "Product added to cart",

      cart,
    });

  } catch (error) {

    console.error(
      "Error adding to cart",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================
// GET USER CART
// =====================================

const getCart = async (
  req,
  res
) => {

  try {

    const userId = req.user.id;


    // =====================================
    // FIND CART
    // =====================================

    const cart =
      await Cart.findOne({
        user: userId,
      }).populate({
        path: "items.product",
        populate: {
          path: "category",
          select: "name",
        },
      });


    // =====================================
    // EMPTY CART
    // =====================================

    if (!cart) {

      return res.status(200).json({

        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }


    // =====================================
    // TOTALS
    // =====================================

    let totalItems = 0;

    let totalPrice = 0;


    cart.items.forEach((item) => {

      totalItems += item.quantity;

      totalPrice +=
        item.quantity *
        item.product.price;
    });


    return res.status(200).json({

      cart,

      summary: {

        totalItems,

        totalPrice:
          Number(
            totalPrice.toFixed(2)
          ),
      },
    });

  } catch (error) {

    console.error(
      "Error fetching cart",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================
// UPDATE CART ITEM QUANTITY
// =====================================

const updateCartItem = async (
  req,
  res
) => {

  try {

    const userId = req.user.id;

    const { productId } =
      req.params;

    const { quantity } =
      req.body;


    // =====================================
    // VALIDATE QUANTITY
    // =====================================

    if (quantity < 1) {

      return res.status(400).json({
        message:
          "Quantity must be greater than 0",
      });
    }


    // =====================================
    // FIND PRODUCT
    // =====================================

    const product =
      await Product.findById(
        productId
      );

    if (!product) {

      return res.status(404).json({
        message:
          "Product not found",
      });
    }


    // =====================================
    // CHECK STOCK
    // =====================================

    if (quantity > product.stock) {

      return res.status(400).json({
        message:
          `Only ${product.stock} items available`,
      });
    }


    // =====================================
    // FIND CART
    // =====================================

    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {

      return res.status(404).json({
        message:
          "Cart not found",
      });
    }


    // =====================================
    // FIND CART ITEM
    // =====================================

    const cartItem =
      cart.items.find(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (!cartItem) {

      return res.status(404).json({
        message:
          "Item not found in cart",
      });
    }


    // =====================================
    // UPDATE QUANTITY
    // =====================================

    cartItem.quantity =
      quantity;


    // =====================================
    // SAVE
    // =====================================

    await cart.save();


    return res.status(200).json({

      message:
        "Cart updated successfully",

      cart,
    });

  } catch (error) {

    console.error(
      "Error updating cart",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================
// REMOVE CART ITEM
// =====================================

const removeCartItem = async (
  req,
  res
) => {

  try {

    const userId = req.user.id;

    const { productId } =
      req.params;


    // =====================================
    // FIND CART
    // =====================================

    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {

      return res.status(404).json({
        message:
          "Cart not found",
      });
    }


    // =====================================
    // REMOVE ITEM
    // =====================================

    cart.items =
      cart.items.filter(
        (item) =>
          item.product.toString() !==
          productId
      );


    // =====================================
    // SAVE
    // =====================================

    await cart.save();


    return res.status(200).json({

      message:
        "Item removed from cart",

      cart,
    });

  } catch (error) {

    console.error(
      "Error removing cart item",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// clear cart controller

const clearCart = async (
  req,
  res
) => {

  try {

    const userId = req.user.id;   
    // =====================================
    // FIND CART
    // =====================================
    
    const cart =
      await Cart.findOne({
        user: userId,
      }); 
    if (!cart) {
      
      return res.status(404).json({
        message:
          "Cart not found",
      });
    } 
    // =====================================
    // CLEAR ITEMS
    // =====================================
    
    cart.items = [];    
    // =====================================
    // SAVE
    // =====================================
    
    await cart.save();
    
    return res.status(200).json({
      
      message:
        "Cart cleared successfully",
      
      cart,
    });
    
  } catch (error) {
    
    console.error(
      "Error clearing cart",
      error
    );
    
    return res.status(500).json({
      message: "Server error",
    });
  }
};    


module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
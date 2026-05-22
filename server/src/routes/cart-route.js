const {addToCart,getCart,updateCartItem,removeCartItem,clearCart} = require("../controllers/cart-controller");

const express = require("express");

const router = express.Router();

router.post("/", addToCart);
router.get("/", getCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);

module.exports = router;
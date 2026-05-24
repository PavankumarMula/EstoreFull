const express = require("express");
const {createOrder,getOrderDetails,getOrderHistory} = require("../controllers/order-controller");

const router = express.Router();

router.post("/",createOrder);

router.get("/history",getOrderHistory);

router.get("/:id",getOrderDetails);


module.exports = router;
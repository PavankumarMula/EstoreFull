const express = require("express");
const {createOrder,getOrderDetails,getOrderHistory,cancelOrder,getAdminOrders,updateOrderStatusForAdmin} = require("../controllers/order-controller");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();

router.post("/", createOrder);

router.get("/history", getOrderHistory);

router.get("/admin", isAdmin, getAdminOrders);

router.post(
   "/admin/:orderId/status",
   isAdmin,
   updateOrderStatusForAdmin
);

router.post("/cancel/:orderId", cancelOrder);

router.get("/:id", getOrderDetails);



module.exports = router;
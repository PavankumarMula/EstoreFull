
// MODELS
const Order = require("../models/order-model");

const Cart = require("../models/cart-model");

const {Product} = require("../models/product-model");

// CREATE ORDER
const createOrder = async (req, res) => {
    try {
        // GET USER ID
        const userId = req.user.id;

        // GET REQUEST DATA
        const { shippingAddress, paymentMethod, } = req.body;

        // VALIDATE PAYMENT METHOD
        if (!["COD", "ONLINE"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // FIND USER CART
        const userCart = await Cart.findOne({ user: userId, }).populate("items.product");

        // CHECK CART EXISTS
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // CHECK CART NOT EMPTY
        if (userCart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // PREPARE ORDER DATA
        const orderItems = [];
        let subtotal = 0;

        // LOOP THROUGH CART ITEMS
        for (const item of userCart.items) {
            // CHECK PRODUCT EXISTS
            if (!item.product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // CHECK STOCK
            if (item.quantity > item.product.stock) {
                return res.status(400).json({
                    message:
                        `Only ${item.product.stock} items available for ${item.product.title}`,
                });
            }

            // CALCULATE ITEM SUBTOTAL
            const itemSubtotal = item.quantity * item.product.price;

            // UPDATE ORDER SUBTOTAL
            subtotal += itemSubtotal;

            // CREATE ORDER ITEM SNAPSHOT
            orderItems.push({
                product: item.product._id,
                title: item.product.title,
                image: item.product.thumbnail,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: itemSubtotal,
            });

            // REDUCE PRODUCT STOCK
            item.product.stock -= item.quantity;

            // SAVE UPDATED PRODUCT
            await item.product.save();
        }

        // SHIPPING FEE
        const shippingFee = subtotal > 1000 ? 0 : 100;

        // FINAL TOTAL
        const totalAmount = subtotal + shippingFee;

        // CREATE ORDER
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingFee,
            totalAmount,
            orderStatus: "PENDING",
            paymentStatus: "PENDING",
        });


        // CLEAR USER CART
        userCart.items = [];

        // SAVE EMPTY CART
        await userCart.save();

        // SUCCESS RESPONSE
        return res.status(201).json({ message: "Order created successfully", orderId: order._id });
    } catch (error) {
        console.error(
            "Create order error",
            error
        );

        return res.status(500).json({

            message:
                error.message ||
                "Internal server error",
        });
    }
};

// GET ORDER DETAILS
const getOrderDetails = async (req, res) => {
    try {
        // GET USER ID
        const userId = req.user.id;

        // GET ORDER ID
        const orderId = req.params.id;

        // FIND ORDER
        const order = await Order.findOne({ _id: orderId, user: userId });

        // CHECK ORDER EXISTS
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // SUCCESS RESPONSE
        return res.status(200).json({ order });
    } catch (error) {
        console.error(
            "Get order details error",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Internal server error",
        });
    }
};

// GET ORDER HISTORY
const getOrderHistory = async (req, res) => {
    try {
        // GET USER ID
        const userId = req.user.id;

        // FIND USER ORDERS
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

        // SUCCESS RESPONSE
        return res.status(200).json({ orders });
    } catch (error) {
        console.error(
            "Get order history error",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Internal server error",
        });
    }
};

// cancel order
const mongoose = require("mongoose");

const cancelOrder = async (req, res) => {

    let session;
    try {
        // START SESSION & TRANSACTION
        session = await mongoose.startSession();
        session.startTransaction();

        // GET USER ID & ORDER ID
        const userId = req.user.id;
        const { orderId } = req.params;

        // FIND ORDER
        const order = await Order.findOne({
            _id: orderId,
            user: userId,
        }).session(session);

        // CHECK ORDER EXISTS
        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // VALIDATE ORDER STATUS
        const cancellableStatuses = [
            "PENDING",
            "CONFIRMED",
        ];

        if (
            !cancellableStatuses.includes(
                order.orderStatus
            )
        ) {
            await session.abortTransaction();
            return res.status(400).json({
                message:
                    `Order cannot be cancelled at this stage. Current status: ${order.orderStatus}`,
            });
        }

        // PREVENT DOUBLE CANCELLATION
        if (order.orderStatus === "CANCELLED") {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Order already cancelled",
            });
        }

        // RESTORE PRODUCT STOCK
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    // ATOMIC STOCK RESTORE
                    $inc: {
                        stock: item.quantity,
                    },
                },
                {
                    session,
                }
            );
        }

      
        // UPDATE ORDER STATUS
        order.orderStatus = "CANCELLED";
        order.cancelledAt = new Date();
        await order.save({
            session,
        });

      
        // COMMIT TRANSACTION
        await session.commitTransaction();

        // SUCCESS RESPONSE
        return res.status(200).json({
            message:
                "Order cancelled successfully",
        });
    } catch (error) {
        // ROLLBACK TRANSACTION
        if (session) {
            await session.abortTransaction();
        }

        console.error(
            "Cancel order error",
            error
        );

        return res.status(500).json({

            message:
                error.message ||
                "Internal server error",
        });

    } finally {

      
        // END SESSION
      

        if (session) {
            session.endSession();
        }
    }
};
   
// get orders for admin with pagination and sorting with filtering by status with name search and date range filter
const getAdminOrders = async (req, res) => {
    try {
        // GET QUERY PARAMS
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            status,
            search,
            startDate,
            endDate,
        } = req.query;

        // BUILD FILTER OBJECT
        const filter = {};

        if (status) {
            filter.orderStatus = status;
        }

        if (search) {
            filter["items.title"] = { $regex: search, $options: "i" };
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        // CALCULATE SKIP
        const skip = (page - 1) * limit;

        // FETCH ORDERS WITH PAGINATION, SORTING, AND FILTERING // populate user detials onl;ly include name 

        const orders = await Order.find(filter)
            .populate("user", "name")
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // GET TOTAL COUNT FOR PAGINATION
        const totalOrders = await Order.countDocuments(filter);

        // SUCCESS RESPONSE
        return res.status(200).json({
            orders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error(
            "Get admin orders error",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Internal server error",
        });
    }           
};  

// update order status for admin
const updateOrderStatusForAdmin = async (req, res) => {
    try {
        // GET ORDER ID & NEW STATUS
        const { orderId } = req.params;
        const { status } = req.body;

        // VALIDATE NEW STATUS
        const validStatuses = [
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        // FIND ORDER
        const order = await Order.findById(orderId);

        // CHECK ORDER EXISTS
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // UPDATE ORDER STATUS
        order.orderStatus = status;
        await order.save();

        // SUCCESS RESPONSE
        return res.status(200).json({
            message: "Order status updated successfully",
        });
    } catch (error) {
        console.error(
            "Update order status error",
            error
        );

        return res.status(500). json({
            message:
                error.message ||
                "Internal server error",
        });
    }
};
    


module.exports = {
    createOrder,
    getOrderDetails,
    getOrderHistory,
    cancelOrder,
    getAdminOrders,
    updateOrderStatusForAdmin,
};
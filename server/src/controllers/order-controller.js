
// MODELS
const Order = require("../models/order-model");

const Cart = require("../models/cart-model");

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


// EXPORT


module.exports = {
    createOrder,
    getOrderDetails,
    getOrderHistory,
};
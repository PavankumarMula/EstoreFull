const mongoose =
    require("mongoose");


// =====================================
// ORDER ITEM SCHEMA
// =====================================

const orderItemSchema =
    new mongoose.Schema({

        product: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "Product",

            required: true,
        },

        // SNAPSHOT DATA

        title: {

            type: String,

            required: true,
        },

        image: {

            type: String,

            required: true,
        },

        price: {

            type: Number,

            required: true,
        },

        quantity: {

            type: Number,

            required: true,

            min: 1,
        },

        subtotal: {

            type: Number,

            required: true,
        },

    });


// =====================================
// SHIPPING ADDRESS SCHEMA
// =====================================

const shippingAddressSchema =
    new mongoose.Schema({

        fullName: {

            type: String,

            required: true,
        },

        phone: {

            type: String,

            required: true,
        },

        addressLine1: {

            type: String,

            required: true,
        },

        addressLine2: {

            type: String,
        },

        city: {

            type: String,

            required: true,
        },

        state: {

            type: String,

            required: true,
        },

        postalCode: {

            type: String,

            required: true,
        },

        country: {

            type: String,

            default: "India",
        },

    });


// =====================================
// MAIN ORDER SCHEMA
// =====================================

const orderSchema =
    new mongoose.Schema({

        user: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,
        },

        items: [

            orderItemSchema

        ],

        shippingAddress:
            shippingAddressSchema,

        paymentMethod: {

            type: String,

            enum: [
                "COD",
                "ONLINE",
            ],

            required: true,
        },

        orderStatus: {

            type: String,

            enum: [
                "PENDING",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ],

            default: "PENDING",
        },

        paymentStatus: {

            type: String,

            enum: [
                "PENDING",
                "PAID",
                "FAILED",
                "REFUNDED",
            ],

            default: "PENDING",
        },

        subtotal: {

            type: Number,

            required: true,
        },

        shippingFee: {

            type: Number,

            default: 0,
        },

        totalAmount: {

            type: Number,

            required: true,
        },

    },
        {
            timestamps: true,
        });


// =====================================
// EXPORT
// =====================================

const Order =
    mongoose.model(
        "Order",
        orderSchema
    );

module.exports = Order;
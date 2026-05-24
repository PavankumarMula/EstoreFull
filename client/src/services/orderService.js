import axiosInstance from "@/api/axios";

// create order

// ADD TO CART
export const createOrder =
  async (orderData) => {

    const response =
      await axiosInstance.post(
        "/order",
        orderData
      );

    return response.data;
};

// get order history
export const getOrderHistory =
  async () => {

    const response =
      await axiosInstance.get(
        "/order/history"
      );

    return response.data;
};

// get order details
export const getOrderDetails =
  async (orderId) => {
    const response =
      await axiosInstance.get(
        `/order/${orderId}`
      );

    return response.data;
};


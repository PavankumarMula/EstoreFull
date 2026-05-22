import axiosInstance
  from "@/api/axios";


// GET CART
export const getCart =
  async () => {

    const response =
      await axiosInstance.get(
        "/cart"
      );
    
    return response.data;
};


// ADD TO CART
export const addToCart =
  async (cartData) => {

    const response =
      await axiosInstance.post(
        "/cart",
        cartData
      );

    return response.data;
};


// UPDATE CART ITEM
export const updateCartItem =
  async ({
    productId,
    quantity,
  }) => {

    const response =
      await axiosInstance.put(
        `/cart/${productId}`,
        {
          quantity,
        }
      );

    return response.data;
};


// REMOVE FROM CART
export const removeFromCart =
  async (productId) => {

    const response =
      await axiosInstance.delete(
        `/cart/${productId}`
      );

    return response.data;
};


// CLEAR CART
export const clearCart =
  async () => {

    const response =
      await axiosInstance.delete(
        "/cart/clear"
      );

    return response.data;
};
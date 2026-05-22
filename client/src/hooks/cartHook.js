import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../services/cartService";


// GET CART
export const useGetCart =
  () => {

    return useQuery({
      queryKey: ["cart"],
      queryFn: getCart,
    });
};


// ADD TO CART
export const useAddToCart =
  () => {

    return useMutation({
      mutationFn: addToCart,
    });
};


// UPDATE CART ITEM
export const useUpdateCartItem =
  () => {

    return useMutation({
      mutationFn:
        updateCartItem,
    });
};


// REMOVE FROM CART
export const useRemoveFromCart =
  () => {

    return useMutation({
      mutationFn:
        removeFromCart,
    });
};


// CLEAR CART
export const useClearCart =
  () => {

    return useMutation({
      mutationFn: clearCart,
    });
};
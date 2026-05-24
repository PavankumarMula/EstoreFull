import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";

import {
  createOrder,
  getOrderDetails,
  getOrderHistory,
} from "../services/orderService";


// get order details
export const useGetOrderDetails =
  (orderId) => {
    return useQuery({
      queryKey: ["order", orderId],
      queryFn: () => getOrderDetails(orderId),
      enabled: !!orderId, // Only run query if orderId is truthy
    });
};

// get order history
export const useGetOrderHistory =
  () => {
    return useQuery({
      queryKey: ["order-history"],
      queryFn: getOrderHistory,
    });
};

// Create ORDER
export const usecreateOrder =
  () => {
    return useMutation({
      mutationFn: createOrder,
    });
};
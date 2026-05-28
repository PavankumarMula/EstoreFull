import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";

import {
  createOrder,
  getOrderDetails,
  getOrderHistory,
  cancelOrder,
  getAdminOrders,
  updateOrderStatusForAdmin,
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

// cancel order
export const useCancelOrder =
  () => {
    return useMutation({
      mutationFn: cancelOrder,
    });
};

export const useGetAdminOrders = (params) => {
    return useQuery({
        queryKey: ["admin-orders", params],
        queryFn: () => getAdminOrders(params),
    });
};

export const useUpdateOrderStatusForAdmin = () => {
    return useMutation({
        mutationFn: updateOrderStatusForAdmin,
    });
};


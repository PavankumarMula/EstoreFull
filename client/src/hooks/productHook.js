import { useQuery } from "@tanstack/react-query";

import {
  getProducts,
  getProductById
} from "../services/productService";


export const useGetProducts = (
  filters
) => {

  return useQuery({

    queryKey: [
      "products",
      filters,
    ],

    queryFn: () =>
      getProducts(filters),

    keepPreviousData: true,
  });
};


export const useGetProductById = (id) =>  {
  // Implement the logic to fetch a single product by ID using useQuery
  return useQuery({

    queryKey: [
      "product",
      id,
    ],

    queryFn: () =>
      getProductById( id ),
  }); 
}
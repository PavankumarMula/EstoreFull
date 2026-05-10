import { useQuery } from "@tanstack/react-query";

import {
  getProducts,
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
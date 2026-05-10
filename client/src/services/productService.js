import axiosInstance from "../api/axios";

export const getProducts = async ({
  page = 1,
  limit = 12,
  search = "",
  category = "",
  maxPrice = 5000,
  sort = "newest",
  inStock = false,
}) => {

  const response =
    await axiosInstance.get(
      "/products",
      {
        params: {
          page,
          limit,
          search,
          category,
          maxPrice,
          sort,
          inStock,
        },
      }
    );

  return response.data;
};
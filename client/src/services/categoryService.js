import axiosInstance from "../api/axios";

export const getCategories =
  async () => {

    const response =
      await axiosInstance.get(
        "/categories"
      );

    return response.data;
  };
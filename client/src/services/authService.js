import axiosInstance from "../api/axios";

// SIGN IN
export const signIn = async (credentials) => {
  const response = await axiosInstance.post("/auth/signin", credentials);

  return response.data;
};

// SIGN OUT
export const signOut = async () => {
  const response = await axiosInstance.post("/auth/signout");

  return response.data;
};

// get current user
export const getCurrentUser = async () => {
  const response = await axiosInstance.post("/auth/getCurrentUser");

  return response.data;
};
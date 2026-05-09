import axiosInstance from "../api/axios";

// CREATE USER
export const createUser = async (userData) => {
  const response = await axiosInstance.post(
    "/users",
    userData
  );

  return response.data;
};

// UPDATE USER
export const updateUser = async ({
  id,
  userData,
}) => {
  const response = await axiosInstance.patch(
    `/users/${id}`,
    userData
  );

  return response.data;
};

// DELETE USER
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(
    `/users/${id}`
  );

  return response.data;
};

// GET ALL USERS
export const getUsers = async () => {
  const response = await axiosInstance.get(
    "/users"
  );

  return response.data.users;
};

// GET USER BY ID
export const getUserById = async (id) => {
  const response = await axiosInstance.get(
    `/users/${id}`
  );

  return response.data.user;
};
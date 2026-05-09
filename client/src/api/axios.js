import axios from "axios";

import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});


// ==============================
// REQUEST INTERCEPTOR
// ==============================

axiosInstance.interceptors.request.use(
  (config) => {

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ==============================
// RESPONSE INTERCEPTOR
// ==============================

axiosInstance.interceptors.response.use(
   
  // SUCCESS
  (response) => response,

  // ERROR
  async (error) => {
    debugger
    const originalRequest =
      error.config;

    const errorCode =
      error.response?.data?.code;

    const isRefreshRequest =
      originalRequest?.url?.includes(
        "/auth/refresh-token"
      );

    // ==============================
    // TOKEN EXPIRED
    // ==============================

    if (
      error.response?.status === 401 &&
      errorCode === "TOKEN_EXPIRED" &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        // NO REFRESH TOKEN
        if (!refreshToken) {

          toast.error(
            "Session expired. Please sign in again."
          );

          localStorage.removeItem(
            "accessToken"
          );

          window.location.href =
            "/signin";

          return Promise.reject(error);
        }

        // CALL REFRESH ENDPOINT
        const response =
          await axios.post(
            "http://localhost:3000/api/auth/refresh-token",
            {
              refreshToken,
            }
          );
         debugger
        // GET NEW TOKENS
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        } = response.data.tokens;

        // STORE NEW TOKENS
        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        localStorage.setItem(
          "refreshToken",
          newRefreshToken
        );

        // UPDATE HEADER
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // RETRY ORIGINAL REQUEST
        return axiosInstance(
          originalRequest
        );

      } catch (refreshError) {

        // CLEAR TOKENS
        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        toast.error(
          "Session expired. Please sign in again."
        );

        window.location.href =
          "/signin";

        return Promise.reject(
          refreshError
        );
      }
    }

    // ==============================
    // NORMAL ERROR TOAST
    // ==============================

    if (
      !isRefreshRequest &&
      error.response?.data?.message
    ) {

      toast.error(
        error.response.data.message
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
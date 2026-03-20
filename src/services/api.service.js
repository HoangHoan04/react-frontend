import axios from "axios";
import { API_ENDPOINTS, API_ROUTES } from "./endpoint";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  timeout: API_ROUTES.TIMEOUT,
  headers: API_ROUTES.HEADERS,
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor để xử lý lỗi chung và refresh token
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // No refresh token, logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          throw new Error("No refresh token available");
        }

        // Try to refresh token
        const response = await axios.post(
          `${API_ROUTES.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refresh_token: refreshToken },
          {
            headers: API_ROUTES.HEADERS,
          },
        );

        const newAccessToken =
          response.data.access_token || response.data.accessToken;
        const newRefreshToken =
          response.data.refresh_token || response.data.refreshToken;

        if (newAccessToken) {
          // Update tokens in localStorage
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Update auth store
          const { useAuthStore } = await import("../stores");
          useAuthStore.setState({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        throw new Error(`Token refresh failed: ${refreshError.message}`);
      }
    }

    // Handle other errors
    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.statusText,
      );
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw error;
    }
  },
);

const rootApiService = {
  get: (url, headers = {}) => axiosInstance.get(url, { headers }),

  post: (url, body, headers = {}) => {
    if (body instanceof FormData) {
      return axiosInstance.post(url, body, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return axiosInstance.post(url, body, { headers });
  },

  put: (url, body, headers = {}) => axiosInstance.put(url, body, { headers }),

  delete: (url, headers = {}) => axiosInstance.delete(url, { headers }),
};

export default rootApiService;

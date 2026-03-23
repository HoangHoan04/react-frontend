import axios from "axios";
import { API_ENDPOINTS, API_ROUTES } from "./endpoint";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  timeout: API_ROUTES.TIMEOUT,
  headers: API_ROUTES.HEADERS,
});

const STATUS_MESSAGES_VI = {
  400: "Yêu cầu không hợp lệ",
  401: "Thông tin đăng nhập không đúng hoặc phiên đăng nhập đã hết hạn",
  403: "Bạn không có quyền truy cập",
  404: "Không tìm thấy tài nguyên",
  408: "Yêu cầu quá thời gian chờ",
  500: "Máy chủ đang gặp sự cố",
  502: "Máy chủ tạm thời không sẵn sàng",
  503: "Dịch vụ tạm thời gián đoạn",
};

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
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest =
      requestUrl.includes(API_ENDPOINTS.AUTH.LOGIN) ||
      requestUrl.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const hasValidRefreshToken =
          refreshToken &&
          refreshToken !== "undefined" &&
          refreshToken !== "null";

        if (!hasValidRefreshToken) {
          // No refresh token, logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          throw new Error("Không tìm thấy refresh token");
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
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;``
          return axiosInstance(originalRequest);
        }

        throw new Error("Không nhận được access token từ API refresh");
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        const refreshMessage =
          refreshError?.response?.data?.message ||
          refreshError?.message ||
          "Không thể làm mới phiên đăng nhập";
        throw new Error(`Lỗi làm mới phiên đăng nhập: ${refreshMessage}`);
      }
    }

    // Handle other errors
    if (error.response) {
      const statusCode = error.response.status;
      const serverMessage = error.response.data?.message;
      const fallbackMessage =
        STATUS_MESSAGES_VI[statusCode] || "Đã xảy ra lỗi, vui lòng thử lại";

      if (Array.isArray(serverMessage)) {
        throw new Error(serverMessage.join("; "));
      }

      if (typeof serverMessage === "string" && serverMessage.trim()) {
        if (serverMessage.toLowerCase() === "unauthorized") {
          throw new Error(STATUS_MESSAGES_VI[401]);
        }
        throw new Error(serverMessage);
      }

      throw new Error(fallbackMessage);
    } else if (error.request) {
      throw new Error("Không nhận được phản hồi từ máy chủ");
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

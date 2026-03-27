import { useState } from "react";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";
import { useAuthStore } from "../../stores";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, setUser } = useAuthStore();

  const loginUser = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const loginResponse = await rootApiService.post(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password },
      );

      const accessToken =
        loginResponse.access_token || loginResponse.accessToken;
      const refreshToken =
        loginResponse.refresh_token || loginResponse.refreshToken;

      if (!accessToken) {
        throw new Error("Không nhận được access token từ API đăng nhập");
      }
      login(accessToken, refreshToken);
      const profileResponse = await rootApiService.get(
        API_ENDPOINTS.AUTH.PROFILE,
        { Authorization: `Bearer ${accessToken}` },
      );
      setUser(profileResponse);
      return { success: true, data: profileResponse };
    } catch (err) {
      const errorMessage = err.message || "Đăng nhập thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
    error,
    setError,
  };
};

// Hook to fetch and refresh user profile
export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, accessToken } = useAuthStore();

  const fetchProfile = async () => {
    if (!accessToken) return { success: false };

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(API_ENDPOINTS.AUTH.PROFILE, {
        Authorization: `Bearer ${accessToken}`,
      });
      setUser(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Lấy thông tin người dùng thất bại";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchProfile, isLoading, error };
};

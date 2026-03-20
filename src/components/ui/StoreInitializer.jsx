import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useAuthStore, useThemeStore } from "@/stores";
import { useEffect } from "react";

export const StoreInitializer = () => {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeTheme = useThemeStore((state) => state.initialize);
  const setUser = useAuthStore((state) => state.setUser);
  const { isAuthenticated, user, accessToken } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    initializeTheme();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && accessToken && !user) {
        const profile = await rootApiService.get(API_ENDPOINTS.AUTH.PROFILE, {
          Authorization: `Bearer ${accessToken}`,
        });
        setUser(profile);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, accessToken, user, setUser]);

  return null;
};

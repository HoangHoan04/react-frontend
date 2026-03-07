import { useAuthStore, useThemeStore } from "@/stores";
import { useEffect } from "react";

export const StoreInitializer = () => {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeTheme = useThemeStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
    initializeTheme();
  }, [initializeAuth, initializeTheme]);

  return null;
};

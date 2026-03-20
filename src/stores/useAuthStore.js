import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
  isAuthenticated: false,

  // Initialize from localStorage - load tokens only
  initialize: () => {
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");

    if (savedAccessToken && savedRefreshToken) {
      set({
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      set({ loading: false, isAuthenticated: false });
    }
  },

  // Save tokens after login
  login: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  // Update user profile (fetch from API, not from token)
  setUser: (userData) => {
    set({ user: userData });
  },

  // Logout - clear everything
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  // Update tokens on refresh
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ accessToken, refreshToken });
  },

  // Update user data
  updateUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData },
    }));
  },
}));

import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  // Initialize from localStorage
  initialize: () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        set({ user, isAuthenticated: true, loading: false });
      } catch (error) {
        console.error("Error parsing saved user:", error);
        set({ loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  login: (userData) => {
    set({ user: userData, isAuthenticated: true });
    localStorage.setItem("user", JSON.stringify(userData));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("user");
  },

  updateUser: (userData) =>
    set((state) => {
      const updated = { ...state.user, ...userData };
      localStorage.setItem("user", JSON.stringify(updated));
      return { user: updated };
    }),
}));

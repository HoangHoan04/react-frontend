import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],

  showToast: ({ type = "info", title = "", message = "", timeout = 3000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message, timeout };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, timeout);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

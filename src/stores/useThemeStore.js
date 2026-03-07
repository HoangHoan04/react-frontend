import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: (() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  })(),

  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme);
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }
    html.setAttribute("data-theme", newTheme);
    set({ theme: newTheme });
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      const html = document.documentElement;
      if (newTheme === "dark") {
        html.classList.add("dark");
        html.style.colorScheme = "dark";
      } else {
        html.classList.remove("dark");
        html.style.colorScheme = "light";
      }
      html.setAttribute("data-theme", newTheme);
      return { theme: newTheme };
    }),

  // Initialize theme on app load
  initialize: () => {
    const theme = useThemeStore.getState().theme;
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }
    html.setAttribute("data-theme", theme);
  },
}));

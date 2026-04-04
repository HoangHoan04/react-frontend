import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const applyThemeToDOM = (theme) => {
  const html = document.documentElement;
  const isDark = theme === "dark";

  if (isDark) {
    html.classList.add("dark");
    html.style.colorScheme = "dark";
  } else {
    html.classList.remove("dark");
    html.style.colorScheme = "light";
  }
  html.setAttribute("data-theme", theme);
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",

      setTheme: (newTheme) => {
        applyThemeToDOM(newTheme);
        set({ theme: newTheme });
      },

      toggleTheme: () => {
        const nextTheme = get().theme === "light" ? "dark" : "light";
        applyThemeToDOM(nextTheme);
        set({ theme: nextTheme });
      },

      initialize: () => {
        const currentTheme = get().theme;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        const finalTheme = currentTheme || systemTheme;

        applyThemeToDOM(finalTheme);
        set({ theme: finalTheme });
      },
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

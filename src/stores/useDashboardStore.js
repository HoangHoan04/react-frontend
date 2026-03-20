import { create } from "zustand";
export const useDashboardStore = create((set) => ({
  selectedChart: "bar",
  isVisible: false,
  data: [],
  setSelectedChart: (chart) => set({ selectedChart: chart }),
  setIsVisible: (visible) => set({ isVisible: visible }),
  setData: (data) => set({ data }),
}));

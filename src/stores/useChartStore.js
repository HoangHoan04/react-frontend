import { create } from "zustand";

export const useChartStore = create((set) => ({
  currentIdActive: 0,
  currentChart: null,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));

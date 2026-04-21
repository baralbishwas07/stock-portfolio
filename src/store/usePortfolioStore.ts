import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PortfolioStock } from "../types/stock";
import { defaultPortfolio } from "../data/mockStocks";

// Shape of our global state.
interface PortfolioState {
  stocks: PortfolioStock[];
  selectedTicker: string; // which stock is selected for chart viewing

  // Actions
  addStock: (stock: Omit<PortfolioStock, "id">) => void;
  updateStock: (id: string, updates: Partial<PortfolioStock>) => void;
  deleteStock: (id: string) => void;
  setSelectedTicker: (ticker: string) => void;
}

// Zustand store with `persist` middleware.
// `persist` automatically saves/loads from localStorage.
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      stocks: defaultPortfolio,
      selectedTicker: "AAPL",

      addStock: (stock) =>
        set((state) => ({
          stocks: [...state.stocks, { ...stock, id: crypto.randomUUID() }],
        })),

      updateStock: (id, updates) =>
        set((state) => ({
          stocks: state.stocks.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),

      deleteStock: (id) =>
        set((state) => ({
          stocks: state.stocks.filter((s) => s.id !== id),
        })),

      setSelectedTicker: (ticker) => set({ selectedTicker: ticker }),
    }),
    {
      name: "portfolio-storage", // localStorage key
    },
  ),
);

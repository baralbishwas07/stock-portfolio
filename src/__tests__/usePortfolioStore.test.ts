import { describe, it, expect, beforeEach } from "vitest";
import { usePortfolioStore } from "../store/usePortfolioStore";

describe("usePortfolioStore", () => {
  // Reset store before each test to avoid test pollution.
  beforeEach(() => {
    const { stocks } = usePortfolioStore.getState();
    // Delete all stocks
    stocks.forEach((s) => usePortfolioStore.getState().deleteStock(s.id));
  });

  it("should add a stock", () => {
    const { addStock } = usePortfolioStore.getState();

    addStock({
      ticker: "NVDA",
      companyName: "NVIDIA Corp.",
      quantity: 5,
      purchasePrice: 450,
      currentPrice: 480,
      dateOfPurchase: "2025-11-01",
    });

    const { stocks } = usePortfolioStore.getState();
    expect(stocks).toHaveLength(1);
    expect(stocks[0].ticker).toBe("NVDA");
    expect(stocks[0].id).toBeDefined(); // UUID was auto-generated
  });

  it("should update a stock", () => {
    const { addStock } = usePortfolioStore.getState();

    addStock({
      ticker: "NVDA",
      companyName: "NVIDIA Corp.",
      quantity: 5,
      purchasePrice: 450,
      currentPrice: 480,
      dateOfPurchase: "2025-11-01",
    });

    const { stocks, updateStock } = usePortfolioStore.getState();
    const id = stocks[0].id;

    updateStock(id, { quantity: 10, currentPrice: 500 });

    const updated = usePortfolioStore.getState().stocks[0];
    expect(updated.quantity).toBe(10);
    expect(updated.currentPrice).toBe(500);
    expect(updated.ticker).toBe("NVDA"); // unchanged fields stay
  });

  it("should delete a stock", () => {
    const { addStock } = usePortfolioStore.getState();

    addStock({
      ticker: "NVDA",
      companyName: "NVIDIA Corp.",
      quantity: 5,
      purchasePrice: 450,
      currentPrice: 480,
      dateOfPurchase: "2025-11-01",
    });

    const { stocks, deleteStock } = usePortfolioStore.getState();
    deleteStock(stocks[0].id);

    expect(usePortfolioStore.getState().stocks).toHaveLength(0);
  });

  it("should set selected ticker", () => {
    const { setSelectedTicker } = usePortfolioStore.getState();
    setSelectedTicker("GOOGL");
    expect(usePortfolioStore.getState().selectedTicker).toBe("GOOGL");
  });
});

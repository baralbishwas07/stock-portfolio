import { describe, it, expect } from "vitest";
import { mockHistoricalData, fetchStockHistory } from "../data/mockStocks";

describe("mockStocks", () => {
  it("should have 5 stocks with historical data", () => {
    expect(mockHistoricalData).toHaveLength(5);
    mockHistoricalData.forEach((stock) => {
      expect(stock.ticker).toBeDefined();
      expect(stock.data.length).toBeGreaterThan(0);
    });
  });

  it("should have valid data points", () => {
    const aapl = mockHistoricalData.find((s) => s.ticker === "AAPL")!;
    aapl.data.forEach((point) => {
      expect(point.close).toBeGreaterThan(0);
      expect(point.volume).toBeGreaterThan(0);
      expect(point.high).toBeGreaterThanOrEqual(point.low);
    });
  });

  it("fetchStockHistory should resolve for valid ticker", async () => {
    const data = await fetchStockHistory("AAPL");
    expect(data.ticker).toBe("AAPL");
    expect(data.data.length).toBeGreaterThan(0);
  });

  it("fetchStockHistory should auto-generate data for unknown ticker", async () => {
    const data = await fetchStockHistory(
      "NEWT",
      "New Tech Inc.",
      100,
      150,
      "2025-01-01",
    );
    expect(data.ticker).toBe("NEWT");
    expect(data.companyName).toBe("New Tech Inc.");
    expect(data.data.length).toBeGreaterThan(0);
    // Should end at the latest currentPrice
    expect(data.data[data.data.length - 1].close).toBe(150);
  });
});

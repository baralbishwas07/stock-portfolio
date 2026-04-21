import type { PortfolioStock, StockHistoricalData } from "../types/stock";

// Helper: generate an array of historical price data points.
function generateHistoricalData(
  ticker: string,
  companyName: string,
  basePrice: number,
  days: number = 90,
): StockHistoricalData {
  const data = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random walk: price changes by -3% to +3% each day
    const change = (Math.random() - 0.48) * basePrice * 0.03;
    basePrice = Math.max(basePrice + change, 1); // price can't go below $1

    const open = basePrice;
    const close = open + (Math.random() - 0.5) * basePrice * 0.02;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01;
    const volume = Math.floor(Math.random() * 50_000_000) + 5_000_000;

    data.push({
      date: date.toISOString().split("T")[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
  }

  return { ticker, companyName, data };
}

// Pre-generated historical data for 5 stocks.
export const mockHistoricalData: StockHistoricalData[] = [
  generateHistoricalData("AAPL", "Apple Inc.", 178),
  generateHistoricalData("GOOGL", "Alphabet Inc.", 140),
  generateHistoricalData("MSFT", "Microsoft Corp.", 380),
  generateHistoricalData("TSLA", "Tesla Inc.", 245),
  generateHistoricalData("AMZN", "Amazon.com Inc.", 185),
];

// Default portfolio stocks.
export const defaultPortfolio: PortfolioStock[] = [
  {
    id: crypto.randomUUID(),
    ticker: "AAPL",
    companyName: "Apple Inc.",
    quantity: 10,
    purchasePrice: 165.0,
    currentPrice: 178.5,
    dateOfPurchase: "2025-06-15",
  },
  {
    id: crypto.randomUUID(),
    ticker: "GOOGL",
    companyName: "Alphabet Inc.",
    quantity: 5,
    purchasePrice: 130.0,
    currentPrice: 141.2,
    dateOfPurchase: "2025-08-20",
  },
  {
    id: crypto.randomUUID(),
    ticker: "MSFT",
    companyName: "Microsoft Corp.",
    quantity: 8,
    purchasePrice: 350.0,
    currentPrice: 382.0,
    dateOfPurchase: "2025-03-10",
  },
];

// Simulate an API call with a small delay.
// TanStack Query will call this function.
export function fetchStockHistory(
  ticker: string,
): Promise<StockHistoricalData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = mockHistoricalData.find((s) => s.ticker === ticker);
      if (found) {
        resolve(found);
      } else {
        reject(new Error(`No data found for ticker: ${ticker}`));
      }
    }, 500); // 500ms simulated network delay
  });
}

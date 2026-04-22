import type { PortfolioStock, StockHistoricalData } from "../types/stock";

// Helper: generate an array of historical price data points.
export function generateHistoricalData(
  ticker: string,
  companyName: string,
  startPrice: number,
  days: number = 90,
  endPrice?: number,
): StockHistoricalData {
  const data = [];
  const today = new Date();

  let currentSimPrice = startPrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    let open: number;

    if (endPrice !== undefined) {
      // Linear interpolation from startPrice to endPrice
      const fraction = (days - i) / days;
      const trendPrice = startPrice + (endPrice - startPrice) * fraction;

      // On the final day, make it strictly end up at endPrice for accuracy
      if (i === 0) {
        open = endPrice - Math.random() * endPrice * 0.005; // Open slightly below/above close
      } else {
        // Add minimal noise around the trend
        const noise = (Math.random() - 0.5) * trendPrice * 0.04;
        open = Math.max(trendPrice + noise, 1);
      }
    } else {
      // Original random walk logic for default stocks
      const change = (Math.random() - 0.48) * currentSimPrice * 0.03;
      currentSimPrice = Math.max(currentSimPrice + change, 1);
      open = currentSimPrice;
    }

    let close = open + (Math.random() - 0.5) * open * 0.02;

    // Force final close to exactly match if endPrice is provided
    if (endPrice !== undefined && i === 0) {
      close = endPrice;
    }

    const high = Math.max(open, close) + Math.random() * close * 0.01;
    const low = Math.min(open, close) - Math.random() * close * 0.01;
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

export function fetchStockHistory(
  ticker: string,
  companyName?: string,
  purchasePrice?: number,
  currentPrice?: number,
  dateOfPurchase?: string,
): Promise<StockHistoricalData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = mockHistoricalData.find((s) => s.ticker === ticker);
      if (found) {
        resolve(found);
      } else {
        // Calculate days between purchase and today
        let days = 90;
        if (dateOfPurchase) {
          const purchaseDateObj = new Date(dateOfPurchase);
          const today = new Date();
          const diffDiff = today.getTime() - purchaseDateObj.getTime();
          const diffDays = Math.ceil(diffDiff / (1000 * 60 * 60 * 24));
          // Provide a baseline of 2 days for the chart to function, cap at 365 to prevent lag
          days = Math.max(2, Math.min(diffDays, 365)); 
        }

        // Auto-generate data for any portfolio stock not in the static list.
        resolve(
          generateHistoricalData(
            ticker,
            companyName ?? ticker,
            purchasePrice ?? 100,
            days,
            currentPrice,
          ),
        );
      }
    }, 500);
  });
}

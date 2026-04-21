export interface PortfolioStock {
  id: string; // unique ID
  ticker: string; // e.g. "AAPL"
  companyName: string; // e.g. "Apple Inc."
  quantity: number; // number of shares
  purchasePrice: number; // price per share at purchase
  currentPrice: number; // latest price per share
  dateOfPurchase: string; // ISO date string e.g. "2025-01-15"
}

// A single data point for the stock charts.
// Used by Highcharts to plot line and column charts.
export interface StockDataPoint {
  date: string; // "2025-01-01"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Response shape from our mock API / static data.
export interface StockHistoricalData {
  ticker: string;
  companyName: string;
  data: StockDataPoint[];
}

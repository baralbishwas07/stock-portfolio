import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PortfolioTable from "../components/portfolio/PortfolioTable";
import type { PortfolioStock } from "../types/stock";

const mockStocks: PortfolioStock[] = [
  {
    id: "1",
    ticker: "AAPL",
    companyName: "Apple Inc.",
    quantity: 10,
    purchasePrice: 165,
    currentPrice: 178.5,
    dateOfPurchase: "2025-06-15",
  },
  {
    id: "2",
    ticker: "GOOGL",
    companyName: "Alphabet Inc.",
    quantity: 5,
    purchasePrice: 130,
    currentPrice: 141.2,
    dateOfPurchase: "2025-08-20",
  },
];

describe("PortfolioTable", () => {
  it("should render all stocks", () => {
    render(
      <PortfolioTable
        stocks={mockStocks}
        globalFilter=""
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("GOOGL")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("Alphabet Inc.")).toBeInTheDocument();
  });

  it("should show empty state when no stocks", () => {
    render(
      <PortfolioTable
        stocks={[]}
        globalFilter=""
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByText("No stocks in portfolio. Add one to get started."),
    ).toBeInTheDocument();
  });

  it("should filter stocks by global filter", () => {
    render(
      <PortfolioTable
        stocks={mockStocks}
        globalFilter="AAPL"
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.queryByText("GOOGL")).not.toBeInTheDocument();
  });
});

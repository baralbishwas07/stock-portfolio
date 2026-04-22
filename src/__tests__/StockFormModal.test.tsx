import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StockFormModal from "../components/portfolio/StockFormModal";

describe("StockFormModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  it("should render add mode when no editingStock", () => {
    render(
      <StockFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        editingStock={null}
      />,
    );

    expect(screen.getByRole("heading", { name: "Add Stock" })).toBeInTheDocument();
  });

  it("should render edit mode when editingStock is provided", () => {
    render(
      <StockFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        editingStock={{
          id: "123",
          ticker: "AAPL",
          companyName: "Apple Inc.",
          quantity: 10,
          purchasePrice: 165,
          currentPrice: 178,
          dateOfPurchase: "2025-06-15",
        }}
      />,
    );

    expect(screen.getByText("Edit Stock")).toBeInTheDocument();
  });

  it("should show validation errors on empty submit", async () => {
    render(
      <StockFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        editingStock={null}
      />,
    );

    const user = userEvent.setup();
    // The "Add Stock" button inside the dialog actions
    const submitButtons = screen.getAllByText("Add Stock");
    // Click the submit button (last one, the action button)
    await user.click(submitButtons[submitButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText("Ticker is required")).toBeInTheDocument();
      expect(screen.getByText("Company name is required")).toBeInTheDocument();
    });

    // onSubmit should NOT have been called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});

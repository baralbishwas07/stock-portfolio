import { useState, useCallback } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import PortfolioTable from "../components/portfolio/PortfolioTable";
import PortfolioToolbar from "../components/portfolio/PortfolioToolbar";
import StockFormModal from "../components/portfolio/StockFormModal";
import DeleteConfirmDialog from "../components/portfolio/DeleteConfirmDialog";
import { usePortfolioStore } from "../store/usePortfolioStore";
import type { PortfolioStock } from "../types/stock";

export default function PortfolioPage() {
  const { stocks, addStock, updateStock, deleteStock } = usePortfolioStore();

  // UI state
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<PortfolioStock | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioStock | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info";
  }>({ open: false, message: "", severity: "success" });

  // Handlers wrapped in useCallback to prevent unnecessary re-renders of child components.

  const handleAddClick = useCallback(() => {
    setEditingStock(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((stock: PortfolioStock) => {
    setEditingStock(stock);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const stock = stocks.find((s) => s.id === id);
      if (stock) setDeleteTarget(stock);
    },
    [stocks],
  );

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      // Optimistic: UI updates instantly from Zustand.
      deleteStock(deleteTarget.id);
      setSnackbar({
        open: true,
        message: `${deleteTarget.ticker} removed from portfolio`,
        severity: "info",
      });
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteStock]);

  const handleFormSubmit = useCallback(
    (stock: Omit<PortfolioStock, "id">) => {
      if (editingStock) {
        // Edit mode: update existing stock
        updateStock(editingStock.id, stock);
        setSnackbar({
          open: true,
          message: `${stock.ticker} updated successfully`,
          severity: "success",
        });
      } else {
        // Add mode: create new stock
        addStock(stock);
        setSnackbar({
          open: true,
          message: `${stock.ticker} added to portfolio`,
          severity: "success",
        });
      }
    },
    [editingStock, addStock, updateStock],
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Portfolio
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage your stock portfolio. Add, edit, or remove stocks.
      </Typography>

      <PortfolioToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onAddClick={handleAddClick}
      />

      <PortfolioTable
        stocks={stocks}
        globalFilter={searchValue}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add / Edit modal */}
      <StockFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingStock={editingStock}
      />

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        stockName={deleteTarget?.ticker ?? ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Success/info snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

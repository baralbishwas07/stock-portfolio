import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { PortfolioStock } from "../../types/stock";

interface StockFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (stock: Omit<PortfolioStock, "id">) => void;
  editingStock?: PortfolioStock | null; // null = add mode, defined = edit mode
}

// Form field validation errors
interface FormErrors {
  ticker?: string;
  companyName?: string;
  quantity?: string;
  purchasePrice?: string;
  currentPrice?: string;
  dateOfPurchase?: string;
}

export default function StockFormModal({
  open,
  onClose,
  onSubmit,
  editingStock,
}: StockFormModalProps) {
  const [ticker, setTicker] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [dateOfPurchase, setDateOfPurchase] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // When editing, pre-fill the form with the stock's current data.
  useEffect(() => {
    if (editingStock) {
      setTicker(editingStock.ticker);
      setCompanyName(editingStock.companyName);
      setQuantity(editingStock.quantity.toString());
      setPurchasePrice(editingStock.purchasePrice.toString());
      setCurrentPrice(editingStock.currentPrice.toString());
      setDateOfPurchase(editingStock.dateOfPurchase);
    } else {
      // Reset form for "add" mode
      resetForm();
    }
  }, [editingStock, open]);

  function resetForm() {
    setTicker("");
    setCompanyName("");
    setQuantity("");
    setPurchasePrice("");
    setCurrentPrice("");
    setDateOfPurchase("");
    setErrors({});
  }

  // Basic form validation.
  // Returns true if all fields are valid.
  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!ticker.trim()) {
      newErrors.ticker = "Ticker is required";
    } else if (!/^[A-Z]{1,5}$/i.test(ticker.trim())) {
      newErrors.ticker = "Ticker must be 1-5 letters";
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    const qty = Number(quantity);
    if (!quantity || isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      newErrors.quantity = "Enter a positive whole number";
    }

    const pp = Number(purchasePrice);
    if (!purchasePrice || isNaN(pp) || pp <= 0) {
      newErrors.purchasePrice = "Enter a valid price";
    }

    const cp = Number(currentPrice);
    if (!currentPrice || isNaN(cp) || cp <= 0) {
      newErrors.currentPrice = "Enter a valid price";
    }

    if (!dateOfPurchase) {
      newErrors.dateOfPurchase = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    onSubmit({
      ticker: ticker.trim().toUpperCase(),
      companyName: companyName.trim(),
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      currentPrice: Number(currentPrice),
      dateOfPurchase,
    });

    resetForm();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
        }}
      >
        {editingStock ? "Edit Stock" : "Add Stock"}
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Ticker Symbol"
            placeholder="e.g. AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            error={!!errors.ticker}
            helperText={errors.ticker}
            size="small"
            fullWidth
            // Disable ticker editing when in edit mode
            // (changing a ticker is semantically adding a different stock)
            disabled={!!editingStock}
          />
          <TextField
            label="Company Name"
            placeholder="e.g. Apple Inc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={!!errors.companyName}
            helperText={errors.companyName}
            size="small"
            fullWidth
          />
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            error={!!errors.quantity}
            helperText={errors.quantity}
            size="small"
            fullWidth
          />
          <TextField
            label="Purchase Price ($)"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            error={!!errors.purchasePrice}
            helperText={errors.purchasePrice}
            size="small"
            fullWidth
          />
          <TextField
            label="Current Price ($)"
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            error={!!errors.currentPrice}
            helperText={errors.currentPrice}
            size="small"
            fullWidth
          />
          <TextField
            label="Date of Purchase"
            type="date"
            value={dateOfPurchase}
            onChange={(e) => setDateOfPurchase(e.target.value)}
            error={!!errors.dateOfPurchase}
            helperText={errors.dateOfPurchase}
            size="small"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation>
          {editingStock ? "Update" : "Add Stock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import StockLineChart from "../components/charts/StockLineChart";
import StockColumnChart from "../components/charts/StockColumnChart";
import { fetchStockHistory } from "../data/mockStocks";
import { usePortfolioStore } from "../store/usePortfolioStore";

export default function DashboardPage() {
  const { stocks, selectedTicker, setSelectedTicker } = usePortfolioStore();

  // Find the companyName for the selected ticker so the chart label is correct
  const selectedStock = stocks.find((s) => s.ticker === selectedTicker);

  // TanStack Query fetches (and caches) the mock stock data.
  // The query re-runs whenever selectedTicker changes.
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stockHistory", selectedTicker],
    queryFn: () =>
      fetchStockHistory(
        selectedTicker,
        selectedStock?.companyName,
        selectedStock?.purchasePrice,
        selectedStock?.currentPrice,
        selectedStock?.dateOfPurchase,
      ),
  });

  // Deduplicate tickers from the portfolio store so each appears once in the toggle group
  const tickers = [...new Map(stocks.map((s) => [s.ticker, s])).values()];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        View stock performance over the last 90 days.
      </Typography>

      {/* Ticker selector */}
      <ToggleButtonGroup
        value={selectedTicker}
        exclusive
        onChange={(_, val) => val && setSelectedTicker(val)}
        size="small"
        sx={{ mb: 3 }}
      >
        {tickers.map((s) => (
          <ToggleButton
            key={s.ticker}
            value={s.ticker}
            sx={{
              px: 2,
              fontWeight: 600,
              fontSize: 13,
              textTransform: "none",
              "&.Mui-selected": {
                bgcolor: "#1a1a2e",
                color: "#fff",
                "&:hover": { bgcolor: "#16213e" },
              },
            }}
          >
            {s.ticker}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Loading and error states */}
      {isLoading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error).message}
        </Alert>
      )}

      {/* Charts */}
      {data && (
        <Stack spacing={3}>
          <StockLineChart data={data} />
          <StockColumnChart data={data} />
        </Stack>
      )}
    </Box>
  );
}

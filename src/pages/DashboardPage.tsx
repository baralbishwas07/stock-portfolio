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
import { useState, useMemo } from "react";
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

  const [timeFilter, setTimeFilter] = useState<"Daily" | "Weekly" | "Full">(
    "Full",
  );

  // Deduplicate tickers from the portfolio store so each appears once in the toggle group
  const tickers = [...new Map(stocks.map((s) => [s.ticker, s])).values()];

  // Dynamically slice the data based on the selected timeframe filter
  const filteredChartData = useMemo(() => {
    if (!data) return null;
    let sliced = data.data;

    if (timeFilter === "Daily") {
      // Show the last 2 days (minimum required points to render a trend)
      sliced = data.data.slice(-2);
    } else if (timeFilter === "Weekly") {
      // Show the last 7 days
      sliced = data.data.slice(-7);
    }

    return { ...data, data: sliced };
  }, [data, timeFilter]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        View stock performance over the last 90 days.
      </Typography>

      {/* Top Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
        }}
      >
        {/* Ticker selector */}
        <ToggleButtonGroup
          value={selectedTicker}
          exclusive
          onChange={(_, val) => val && setSelectedTicker(val)}
          size="small"
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

        {/* Timeframe Filter */}
        <ToggleButtonGroup
          value={timeFilter}
          exclusive
          onChange={(_, val) => val && setTimeFilter(val)}
          size="small"
        >
          {["Daily", "Weekly", "Full"].map((time) => (
            <ToggleButton
              key={time}
              value={time}
              sx={{
                px: 2,
                fontWeight: 600,
                fontSize: 13,
                textTransform: "none",
                "&.Mui-selected": {
                  bgcolor: "#e8e8e8",
                  color: "#1a1a2e",
                },
              }}
            >
              {time}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

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
      {filteredChartData && (
        <Stack spacing={3}>
          <StockLineChart data={filteredChartData} />
          <StockColumnChart data={filteredChartData} />
        </Stack>
      )}
    </Box>
  );
}

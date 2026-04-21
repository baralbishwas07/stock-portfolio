import { TextField, InputAdornment, Stack, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

interface PortfolioToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

// Toolbar above the portfolio table.
// Contains a search box (filters by ticker/company) and an "Add Stock" button.
export default function PortfolioToolbar({
  searchValue,
  onSearchChange,
  onAddClick,
}: PortfolioToolbarProps) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <TextField
        placeholder="Search by ticker or company..."
        size="small"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ width: 300 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "#999" }} />
              </InputAdornment>
            ),
          },
        }}
      />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddClick}
        disableElevation
        size="medium"
      >
        Add Stock
      </Button>
    </Stack>
  );
}

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a1a2e",
    },
    secondary: {
      main: "#16213e",
    },
    success: {
      main: "#00b894",
    },
    error: {
      main: "#d63031",
    },
    background: {
      default: "#f5f6fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

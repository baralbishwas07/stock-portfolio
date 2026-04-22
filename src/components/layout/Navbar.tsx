import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Portfolio", path: "/portfolio" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        color: "#1a1a2e",
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
        {/* Logo */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mr: 4 }}>
          <ShowChartIcon />
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            Stock Portfolio
          </Typography>
        </Stack>

        {/* Nav links */}
        <Stack direction="row" spacing={1}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                color: location.pathname === item.path ? "#1a1a2e" : "#888",
                fontWeight: location.pathname === item.path ? 600 : 400,
                borderBottom:
                  location.pathname === item.path
                    ? "2px solid #1a1a2e"
                    : "2px solid transparent",
                borderRadius: 0,
                px: 2,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

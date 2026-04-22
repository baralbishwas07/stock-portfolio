import { Box } from "@mui/material";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

// Root layout wrapper.
export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 3,
          py: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

import { Box, Typography } from "@mui/material";
import { useState } from "react";
import AscendSnackbar from "../../components/AscendSnackbar/AscendSnackbar";
import ImplementationInstructions from "./ImplementationInstructions";
import TenantManagementSection from "./TenantManagementSection";

export default function Settings() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCopy = (value: string, label?: string) => {
    navigator.clipboard.writeText(value);
    setSnackbarMessage(
      label ? `${label} copied to clipboard` : "Copied to clipboard",
    );
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ padding: "32px", width: "100%" }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          color: "#212121",
          marginBottom: "24px",
        }}
      >
        Settings
      </Typography>

      <TenantManagementSection />

      <ImplementationInstructions onCopy={handleCopy} />

      <AscendSnackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage || "Copied to clipboard"}
        severity="success"
      />
    </Box>
  );
}

import { Box, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import AscendSnackbar from "../../components/AscendSnackbar/AscendSnackbar";

export default function Settings() {
  const projectName = import.meta.env.VITE_PROJECT_NAME as string;
  const projectKey = import.meta.env.VITE_PROJECT_KEY as string;
  const apiKey = import.meta.env.VITE_API_KEY as string;

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
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

      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E0E0E0",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#F8F9FC",
            padding: "16px 24px",
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "#33343E",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Project Configuration
          </Typography>
        </Box>

        <Box sx={{ padding: "24px" }}>
          <ConfigItem label="Project Name" value={projectName} />
          <ConfigItem label="Project Key" value={projectKey} />
          <ConfigItem
            label="API Key"
            value={apiKey}
            onCopy={() => handleCopy(apiKey)}
            isLast
          />
        </Box>
      </Box>

      <AscendSnackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="API Key copied to clipboard"
        severity="success"
      />
    </Box>
  );
}

function ConfigItem({
  label,
  value,
  onCopy,
  isLast = false,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  isLast?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        paddingBottom: isLast ? 0 : "20px",
        marginBottom: isLast ? 0 : "20px",
        borderBottom: isLast ? "none" : "1px solid #F0F0F0",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: "#828592",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F8F9FC",
          borderRadius: "6px",
          border: "1px solid #E8E9ED",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#33343E",
            padding: "10px 14px",
            flex: 1,
            wordBreak: "break-all",
          }}
        >
          {value}
        </Typography>
        {onCopy && (
          <IconButton
            onClick={onCopy}
            sx={{
              borderRadius: "0",
              borderLeft: "1px solid #E8E9ED",
              padding: "10px 14px",
              color: "#828592",
              "&:hover": {
                backgroundColor: "#ECEDF1",
                color: "#33343E",
              },
            }}
          >
            <ContentCopyIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

import { Box, Typography, IconButton, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

interface ImplementationInstructionsProps {
  onCopy: (value: string, label: string) => void;
}

export default function ImplementationInstructions({
  onCopy,
}: ImplementationInstructionsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<"reactnative" | "swift" | "kotlin">("reactnative");
  const [configExpanded, setConfigExpanded] = useState(true);

  // Get API configuration
  const apiBaseURL =
    window.__ENV__?.EXPERIMENT_API_BASE_URL ||
    window.__ENV__?.API_BASE_URL ||
    "http://localhost:8100";

  const clientKey =
    window.__ENV__?.PROJECT_KEY?.trim() ||
    window.__ENV__?.VITE_PROJECT_KEY?.trim() ||
    (import.meta.env.VITE_PROJECT_KEY
      ? String(import.meta.env.VITE_PROJECT_KEY).trim()
      : "") ||
    "550e8400-e29b-41d4-a716-446655440001";

  const fullApiEndpoint = `${apiBaseURL}/v1/allocations`;

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        border: "1px solid #E0E0E0",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
        width: "100%",
        marginTop: "24px",
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
          Implementation Instructions
        </Typography>
      </Box>

      <Box sx={{ padding: "24px" }}>
        {/* Language Selection */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 3, flexWrap: "wrap" }}>
        <Button
            variant={selectedLanguage === "kotlin" ? "contained" : "outlined"}
            onClick={() => setSelectedLanguage("kotlin")}
            sx={{
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              borderRadius: "8px",
              padding: "8px 16px",
              border:
                selectedLanguage === "kotlin"
                  ? "2px solid #0060E5"
                  : "1px solid #E0E0E0",
              ...(selectedLanguage === "kotlin"
                ? {
                    backgroundColor: "#FFFFFF",
                    color: "#0060E5",
                    "&:hover": {
                      backgroundColor: "#F8F9FC",
                    },
                  }
                : {
                    borderColor: "#E0E0E0",
                    color: "#33343E",
                    "&:hover": {
                      borderColor: "#0060E5",
                      backgroundColor: "#F8F9FC",
                    },
                  }),
            }}
          >
            Kotlin
          </Button>
          <Button
            variant={selectedLanguage === "swift" ? "contained" : "outlined"}
            onClick={() => setSelectedLanguage("swift")}
            sx={{
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              borderRadius: "8px",
              padding: "8px 16px",
              border:
                selectedLanguage === "swift"
                  ? "2px solid #0060E5"
                  : "1px solid #E0E0E0",
              ...(selectedLanguage === "swift"
                ? {
                    backgroundColor: "#FFFFFF",
                    color: "#0060E5",
                    "&:hover": {
                      backgroundColor: "#F8F9FC",
                    },
                  }
                : {
                    borderColor: "#E0E0E0",
                    color: "#33343E",
                    "&:hover": {
                      borderColor: "#0060E5",
                      backgroundColor: "#F8F9FC",
                    },
                  }),
            }}
          >
            Swift
          </Button>
          <Button
            variant={selectedLanguage === "reactnative" ? "contained" : "outlined"}
            onClick={() => setSelectedLanguage("reactnative")}
            sx={{
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              borderRadius: "8px",
              padding: "8px 16px",
              border:
                selectedLanguage === "reactnative"
                  ? "2px solid #0060E5"
                  : "1px solid #E0E0E0",
              ...(selectedLanguage === "reactnative"
                ? {
                    backgroundColor: "#FFFFFF",
                    color: "#0060E5",
                    "&:hover": {
                      backgroundColor: "#F8F9FC",
                    },
                  }
                : {
                    borderColor: "#E0E0E0",
                    color: "#33343E",
                    "&:hover": {
                      borderColor: "#0060E5",
                      backgroundColor: "#F8F9FC",
                    },
                  }),
            }}
          >
            React Native
          </Button>
        </Box>

        {/* Description */}
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "#666666",
            marginBottom: 3,
          }}
        >
          Below is some starter code to integrate Ascend into your app.

        </Typography>

        <Box
          sx={{
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              backgroundColor: "#F8F9FC",
              cursor: "pointer",
              borderBottom: configExpanded ? "1px solid #E0E0E0" : "none",
            }}
            onClick={() => setConfigExpanded(!configExpanded)}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: "#33343E",
              }}
            >
              {selectedLanguage === "reactnative"
                ? "React Native"
                : selectedLanguage === "swift"
                  ? "Swift"
                  : "Kotlin"}{" "}
              Config Settings
            </Typography>
            <IconButton size="small" sx={{ padding: "4px" }}>
              {configExpanded ? (
                <KeyboardArrowUpIcon sx={{ fontSize: "20px", color: "#666666" }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ fontSize: "20px", color: "#666666" }} />
              )}
            </IconButton>
          </Box>

          {configExpanded && (
            <Box sx={{ padding: "16px" }}>
              <ConfigSettingItem
                label="Full API Endpoint"
                value={fullApiEndpoint}
                onCopy={() => onCopy(fullApiEndpoint, "Full API Endpoint")}
              />
              <ConfigSettingItem
                label="API Host"
                value={apiBaseURL}
                onCopy={() => onCopy(apiBaseURL, "API Host")}
              />
              <ConfigSettingItem
                label="API Key"
                value={clientKey}
                onCopy={() => onCopy(clientKey, "Client Key")}
                isLast
              />
            </Box>
          )}
        </Box>

        {/* Installation Link */}
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "#666666",
            marginTop: 3,
          }}
        >
          For installation, use this{" "}
          <Typography
            component="a"
            href="https://dream-horizon-org.github.io/ascend/sdks/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#0060E5",
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": {
                color: "#0050C5",
              },
            }}
          >
            link
          </Typography>
          .
        </Typography>
      </Box>
    </Box>
  );
}

function ConfigSettingItem({
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
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: isLast ? 0 : "12px",
        marginBottom: isLast ? 0 : "12px",
        borderBottom: isLast ? "none" : "1px solid #F0F0F0",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: "#33343E",
            marginBottom: "4px",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            color: "#666666",
            wordBreak: "break-all",
          }}
        >
          {value}
        </Typography>
      </Box>
      {onCopy && (
        <IconButton
          onClick={onCopy}
          size="small"
          sx={{
            marginLeft: 2,
            color: "#828592",
            "&:hover": {
              backgroundColor: "#F8F9FC",
              color: "#33343E",
            },
          }}
        >
          <ContentCopyIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      )}
    </Box>
  );
}


import { FC } from "react";
import { Box, Typography, IconButton, Chip, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AscendButton from "../../components/AscendButton/AscendButton";
import { ExperimentDetailsHeaderProps } from "./types";

const ExperimentDetailsHeader: FC<ExperimentDetailsHeaderProps> = ({
  title,
  status,
  experimentId,
  onBack,
  onCopyId,
  onMenuClick,
  onConcludeClick,
  className = "",
}) => {
  const getStatusColor = (color?: string) => {
    switch (color) {
      case "active":
        return {
          backgroundColor: "#4CAF50",
          color: "#FFFFFF",
        };
      case "inactive":
        return {
          backgroundColor: "#9E9E9E",
          color: "#FFFFFF",
        };
      case "draft":
        return {
          backgroundColor: "#FF9800",
          color: "#FFFFFF",
        };
      default:
        return {
          backgroundColor: "#4CAF50",
          color: "#FFFFFF",
        };
    }
  };

  const handleCopy = () => {
    if (experimentId && onCopyId) {
      navigator.clipboard.writeText(experimentId);
      onCopyId();
    }
  };

  return (
    <Box
      className={`flex items-center gap-4 px-4 py-3 border-b border-gray-200 ${className}`}
      sx={{
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Back Arrow */}
      {onBack && (
        <IconButton
          onClick={onBack}
          aria-label="go back"
          sx={{
            padding: "0.5rem",
            color: "#595959",
          }}
        >
          <ArrowBackIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      )}

      {/* Title */}
      <Typography
        component="h1"
        sx={{
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: "1rem",
          color: "#333333",
        }}
      >
        {title}
      </Typography>

      {/* Status Badge */}
      {status && (
        <Chip
          label={status.label}
          size="small"
          sx={{
            ...getStatusColor(status.color),
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "0.75rem",
            height: "1.5rem",
            borderRadius: "9999px",
            padding: "0 0.75rem",
          }}
        />
      )}

      {/* Separator */}
      {experimentId && (
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "#DADADD",
            height: "1.5rem",
            margin: "0 0.5rem",
          }}
        />
      )}

      {/* Experiment ID with Copy */}
      {experimentId && (
        <Box className="flex items-center gap-1">
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: "0.875rem",
              color: "#666666",
            }}
          >
            {experimentId}
          </Typography>
          <IconButton
            onClick={handleCopy}
            aria-label="copy experiment id"
            sx={{
              padding: "0.25rem",
              color: "#666666",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ContentCopyIcon sx={{ fontSize: "0.875rem" }} />
          </IconButton>
        </Box>
      )}

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Menu Button */}
      {onMenuClick && (
        <IconButton
          onClick={onMenuClick}
          aria-label="more options"
          sx={{
            padding: "0.5rem",
            color: "#666666",
            backgroundColor: "#F5F5F5",
            borderRadius: "0.5rem",
            "&:hover": {
              backgroundColor: "#E0E0E0",
            },
          }}
        >
          <MoreVertIcon sx={{ fontSize: "1.25rem" }} />
        </IconButton>
      )}

      {/* Conclude Button */}
      {onConcludeClick && (
        <AscendButton
          variant="contained"
          color="primary"
          onClick={onConcludeClick}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            borderRadius: "0.5rem",
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "0.875rem",
            padding: "0.5rem 1rem",
          }}
        >
          Conclude
        </AscendButton>
      )}
    </Box>
  );
};

export default ExperimentDetailsHeader;


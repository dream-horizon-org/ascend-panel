import { FC } from "react";
import { Box, Typography, IconButton, Chip, Divider, useTheme } from "@mui/material";
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
  const theme = useTheme();

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
      className={`flex items-center gap-4 py-3 border-b border-gray-200 ${className}`}
      sx={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Back Arrow */}
      {onBack && (
        <IconButton
          onClick={onBack}
          aria-label="go back"
          sx={{
            padding: "0.5rem",
            color: theme.palette.text.secondary,
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
          color: theme.palette.text.primary,
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
            borderColor: theme.palette.divider,
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
              color: theme.palette.text.secondary,
            }}
          >
            {experimentId}
          </Typography>
          <IconButton
            onClick={handleCopy}
            aria-label="copy experiment id"
            sx={{
              padding: "0.25rem",
              color: theme.palette.text.secondary,
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
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.default,
            borderRadius: "0.5rem",
            "&:hover": {
              backgroundColor: theme.palette.divider,
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


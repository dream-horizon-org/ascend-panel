import { Box, Typography, Paper, useTheme } from "@mui/material";
import { Variant } from "../types";
import { formatNumber, formatDate, calculateDays } from "../../../utils/helpers";
import VariantSummary from "./VariantSummary";
import UserTrend from "./UserTrend";
import { Experiment } from "../../../network/queries/getExperimentDetails/types";

interface ExperimentDetailsContentProps {
  experiment: Experiment;
  variants: Variant[];
  chartData: Array<{ date: string; control: number; variant1: number }>;
}

export default function ExperimentDetailsContent({
  experiment,
  variants,
  chartData,
}: ExperimentDetailsContentProps) {
  const theme = useTheme();

  // Calculate current users from variantCounts if available, otherwise show NA
  const currentUsers: number | "NA" = experiment.variantCounts
    ? Object.values(experiment.variantCounts).reduce(
        (sum, count) => sum + count,
        0,
      )
    : "NA";
  const duration = calculateDays(experiment.startTime, experiment.endTime);
  const lastModified = formatDate(experiment.updatedAt);

  return (
    <Box
      className="p-6"
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            padding: "1.5rem",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "0.5rem",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
              mb: 1,
            }}
          >
            Current Users
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {currentUsers === "NA" ? "NA" : formatNumber(currentUsers)}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            padding: "1.5rem",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "0.5rem",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
              mb: 1,
            }}
          >
            Experiment Duration
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {duration} {duration === 1 ? "Day" : "Days"}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            padding: "1.5rem",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "0.5rem",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
              mb: 1,
            }}
          >
            Last Modified
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {lastModified}
          </Typography>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          padding: "1.5rem",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "0.5rem",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          <VariantSummary variants={variants} />
          <UserTrend chartData={chartData} />
        </Box>
      </Paper>
    </Box>
  );
}


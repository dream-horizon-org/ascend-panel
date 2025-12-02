import {
  Box,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";

import ExperimentDetailsHeader from "./ExperimentDetailsHeader";
import { ChartDataPoint, Variant } from "./types";
import { useExperiment } from "../../network/queries/experiments";
import {
  convertVariantsToDisplay,
  formatDate,
  formatNumber,
  mapStatus,
  calculateDays,
} from "../../utils/helpers";
import ErrorPage from "./components/ErrorPage";
import UserTrend from "./components/UserTrend";
import VariantSummary from "./components/VariantSummary";

export default function ExperimentDetails() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();

  const { data: experiment, isLoading, error } = useExperiment(id || null);

  const chartData: ChartDataPoint[] = [
    { date: "17 Nov", control: 5000, variant1: 10000 },
    { date: "18 Nov", control: 15000, variant1: 25000 },
    { date: "19 Nov", control: 30000, variant1: 50000 },
    { date: "20 Nov", control: 50000, variant1: 80000 },
    { date: "21 Nov", control: 70000, variant1: 100000 },
    { date: "22 Nov", control: 95000, variant1: 115000 },
    { date: "23 Nov", control: 130000, variant1: 130000 },
  ];

  // Convert API variants to display format
  const variants: Variant[] = experiment
    ? convertVariantsToDisplay(
        experiment.variants,
        experiment.variantWeights,
        experiment.variantCounts,
      )
    : [];

  const handleBack = () => {
    navigate(-1);
  };

  const handleCopyId = () => {
    if (experiment?.experimentId) {
      navigator.clipboard.writeText(experiment.experimentId);
      console.log("Experiment ID copied to clipboard");
    }
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  const handleConcludeClick = () => {
    console.log("Conclude clicked");
  };

  const handleCloneExperiment = () => {
    console.log("Clone Experiment clicked");
  };

  const handleTerminateExperiment = () => {
    console.log("Terminate Experiment clicked");
  };

  const handleDeclareWinner = (winner: "Control Group" | "Variant 1") => {
    console.log(`Declare Winner: ${winner}`);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <ErrorPage errorMessage={error.message} severity="error" />;
  }

  if (!experiment) {
    return <ErrorPage errorMessage="Experiment not found" severity="warning" />;
  }

  // Calculate current users from variantCounts if available, otherwise show NA
  const currentUsers: number | "NA" = experiment.variantCounts
    ? Object.values(experiment.variantCounts).reduce(
        (sum, count) => sum + count,
        0,
      )
    : "NA";
  const duration = calculateDays(experiment.startTime, experiment.endTime);
  const lastModified = formatDate(experiment.updatedAt);
  const statusInfo = mapStatus(experiment.status);

  return (
    <Box>
      <ExperimentDetailsHeader
        title={experiment.name}
        status={statusInfo}
        experimentId={`#${experiment.experimentId}`}
        onBack={handleBack}
        onCopyId={handleCopyId}
        onMenuClick={handleMenuClick}
        onConcludeClick={handleConcludeClick}
        onCloneExperiment={handleCloneExperiment}
        onTerminateExperiment={handleTerminateExperiment}
        onDeclareWinner={handleDeclareWinner}
      />
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
    </Box>
  );
}

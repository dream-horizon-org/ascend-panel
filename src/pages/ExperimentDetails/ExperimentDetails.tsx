import {
  Box,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";

import ExperimentDetailsHeader from "./ExperimentDetailsHeader";
import { ChartDataPoint, Variant } from "./types";
import { useExperiment } from "../../network/queries";
import {
  useConcludeExperiment,
  useTerminateExperiment,
} from "../../network/mutations";
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
import AscendSnackbar from "../../components/AscendSnackbar/AscendSnackbar";

export default function ExperimentDetails() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();

  const { data: experiment, isLoading, error } = useExperiment(id || null);

  const concludeMutation = useConcludeExperiment();
  const terminateMutation = useTerminateExperiment();

  // State for copy ID snackbar
  const [copySuccessOpen, setCopySuccessOpen] = useState(false);

  // Extract states from conclude mutation
  const {
    isPending: isConcluding,
    isError: isConcludeError,
    error: concludeError,
    isSuccess: isConcludeSuccess,
  } = concludeMutation;

  // Extract states from terminate mutation
  const {
    isPending: isTerminating,
    isError: isTerminateError,
    error: terminateError,
    isSuccess: isTerminateSuccess,
  } = terminateMutation;

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
      setCopySuccessOpen(true);
    }
  };

  const handleTerminateExperiment = () => {
    if (id && !isTerminating) {
      terminateMutation.mutate({
        id,
        data: { status: "TERMINATED" },
      });
    }
  };

  const handleDeclareWinner = (variantKey: string) => {
    if (id && !isConcluding) {
      concludeMutation.mutate({
        id,
        data: {
          status: "CONCLUDED",
          winning_variant: {
            variant_name: variantKey,
          },
        },
      });
    }
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

  // Snackbar configurations
  const snackbars = [
    {
      open: copySuccessOpen,
      message: "Experiment ID copied to clipboard",
      severity: "success" as const,
      onClose: () => setCopySuccessOpen(false),
    },
    {
      open: isConcludeSuccess,
      message: "Experiment concluded successfully",
      severity: "success" as const,
      onClose: () => concludeMutation.reset(),
    },
    {
      open: isConcludeError,
      message: concludeError?.message || "Failed to conclude experiment",
      severity: "error" as const,
      onClose: () => concludeMutation.reset(),
    },
    {
      open: isTerminateSuccess,
      message: "Experiment terminated successfully",
      severity: "success" as const,
      onClose: () => terminateMutation.reset(),
    },
    {
      open: isTerminateError,
      message: terminateError?.message || "Failed to terminate experiment",
      severity: "error" as const,
      onClose: () => terminateMutation.reset(),
    },
  ];

  return (
    <Box>
      <ExperimentDetailsHeader
        title={experiment.name}
        status={statusInfo}
        experimentId={`#${experiment.experimentId}`}
        experimentStatus={experiment.status}
        variants={experiment.variants}
        onBack={handleBack}
        onCopyId={handleCopyId}
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

      {/* Snackbars */}
      {snackbars.map((snackbar, index) => (
        <AscendSnackbar key={index} {...snackbar} />
      ))}
    </Box>
  );
}

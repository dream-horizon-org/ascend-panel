import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ExperimentDetailsHeader from "./ExperimentDetailsHeader";
import { ChartDataPoint, Variant } from "./types";
import Layout from "../../components/Layout/Layout";
import { useExperiment } from "../../network/queries/experiments";

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Helper function to format number
const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return "N/A";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toString();
};

// Helper function to calculate days between Unix timestamps
const calculateDays = (startTime?: number, endTime?: number): number => {
  if (!startTime) return 0;
  try {
    const start = startTime * 1000; // Convert to milliseconds
    const end = endTime ? endTime * 1000 : Date.now();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

// Helper function to map status to display format
const mapStatus = (
  status: string,
): { label: string; color: "active" | "inactive" | "draft" } => {
  const statusMap: Record<
    string,
    { label: string; color: "active" | "inactive" | "draft" }
  > = {
    LIVE: { label: "Active", color: "active" },
    DRAFT: { label: "Draft", color: "draft" },
    PAUSED: { label: "Paused", color: "inactive" },
    CONCLUDED: { label: "Concluded", color: "inactive" },
  };
  return statusMap[status] || { label: status, color: "draft" };
};

// Helper function to convert variant weights to display format
const convertVariantsToDisplay = (
  variants: Record<string, any>,
  variantWeights: any,
  exposure: number,
): Variant[] => {
  const variantArray: Variant[] = [];
  const colors = ["#1976d2", "#d32f2f", "#388e3c", "#f57c00", "#7b1fa2"];
  let colorIndex = 0;

  Object.entries(variants).forEach(([key, variant]) => {
    const weight = variantWeights?.weights?.[key] || 0;
    const percentage = Math.round(weight * 100);
    // Calculate user count from exposure and weight
    const userCount = Math.round(exposure * weight);

    variantArray.push({
      name: variant.display_name || key,
      color: colors[colorIndex % colors.length],
      percentage,
      userCount,
    });
    colorIndex++;
  });

  return variantArray;
};

export default function ExperimentDetails() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();

  // Fetch experiment data
  const { data: experiment, isLoading, error } = useExperiment(id || null);

  // Mock data for the chart (TODO: Replace with real API data when available)
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
        experiment.exposure || 0,
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

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Failed to load experiment: {error.message}
          </Alert>
        </Box>
      </Layout>
    );
  }

  // Show not found state
  if (!experiment) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">Experiment not found</Alert>
        </Box>
      </Layout>
    );
  }

  // Calculate derived values
  const currentUsers = experiment.exposure || 0;
  const targetUsers = experiment.threshold || 0;
  const duration = calculateDays(experiment.startTime, experiment.endTime);
  const lastModified = formatDate(experiment.updatedAt);
  const statusInfo = mapStatus(experiment.status);

  return (
    <Layout>
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
          {/* Metric Cards */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {/* Current / Targetted Users Card */}
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
                Current / Targetted Users
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {formatNumber(currentUsers)} / {formatNumber(targetUsers)}
              </Typography>
            </Paper>

            {/* Experiment Duration Card */}
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

            {/* Last Modified Card */}
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

          {/* Main Card with Variant Summary and Chart */}
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
              {/* Variant Summary Table - Left Side */}
              <Box sx={{ flex: "0 0 40%" }}>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  Variant Summary
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontFamily: "Inter",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: "0.75rem",
                        }}
                      >
                        Variant
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Inter",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: "0.75rem",
                        }}
                      >
                        %age
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Inter",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: "0.75rem",
                        }}
                      >
                        User Count
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variants.map((variant) => (
                      <TableRow key={variant.name}>
                        <TableCell
                          sx={{
                            fontFamily: "Inter",
                            fontSize: "0.875rem",
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: "0.75rem",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: "0.5rem",
                                height: "0.5rem",
                                borderRadius: "50%",
                                backgroundColor: variant.color,
                              }}
                            />
                            {variant.name}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "Inter",
                            fontSize: "0.875rem",
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: "0.75rem",
                          }}
                        >
                          {variant.percentage}%
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "Inter",
                            fontSize: "0.875rem",
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: "0.75rem",
                          }}
                        >
                          {variant.userCount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              {/* User Trend Chart - Right Side */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  User Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={theme.palette.text.secondary}
                      label={{
                        value: "Time",
                        position: "insideBottom",
                        offset: -5,
                        style: {
                          fontFamily: "Inter",
                          fontSize: "0.75rem",
                          fill: theme.palette.text.secondary,
                        },
                      }}
                      style={{ fontFamily: "Inter", fontSize: "0.75rem" }}
                    />
                    <YAxis
                      stroke={theme.palette.text.secondary}
                      label={{
                        value: "Users",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          fontFamily: "Inter",
                          fontSize: "0.75rem",
                          fill: theme.palette.text.secondary,
                        },
                      }}
                      style={{ fontFamily: "Inter", fontSize: "0.75rem" }}
                      domain={[0, 160000]}
                      tickFormatter={(value) => {
                        if (value >= 1000) {
                          return `${value / 1000}k`;
                        }
                        return value.toString();
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "0.5rem",
                        fontFamily: "Inter",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontFamily: "Inter",
                        fontSize: "0.875rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="control"
                      name="Control Group"
                      stroke="#1976d2"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="variant1"
                      name="Variant 1"
                      stroke="#d32f2f"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}

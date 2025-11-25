import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router";
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

// Mock data for the chart
const chartData: ChartDataPoint[] = [
  { date: "17 Nov", control: 5000, variant1: 10000 },
  { date: "18 Nov", control: 15000, variant1: 25000 },
  { date: "19 Nov", control: 30000, variant1: 50000 },
  { date: "20 Nov", control: 50000, variant1: 80000 },
  { date: "21 Nov", control: 70000, variant1: 100000 },
  { date: "22 Nov", control: 95000, variant1: 115000 },
  { date: "23 Nov", control: 130000, variant1: 130000 },
];

// Variant data
const variants: Variant[] = [
  { name: "Control Group", color: "#1976d2", percentage: 24, userCount: 34656 },
  { name: "Variant 1", color: "#d32f2f", percentage: 76, userCount: 84256 },
];

export default function ExperimentDetails() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCopyId = () => {
    console.log("Experiment ID copied to clipboard");
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  const handleConcludeClick = () => {
    console.log("Conclude clicked");
  };

  return (
    <Box>
      <ExperimentDetailsHeader
        title="IPL 2024 Experiment"
        status={{ label: "Active", color: "active" }}
        experimentId="#IPL-2024-Experiment"
        onBack={handleBack}
        onCopyId={handleCopyId}
        onMenuClick={handleMenuClick}
        onConcludeClick={handleConcludeClick}
      />
      <Box className="p-6" sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
        {/* Metric Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          {/* Current / Targetted Users Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              padding: "1.5rem",
              border: "1px solid #DADADD",
              borderRadius: "0.5rem",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "0.875rem",
                color: "#666666",
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
                color: "#333333",
              }}
            >
              30k / 5.2M
            </Typography>
          </Paper>

          {/* Experiment Duration Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              padding: "1.5rem",
              border: "1px solid #DADADD",
              borderRadius: "0.5rem",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "0.875rem",
                color: "#666666",
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
                color: "#333333",
              }}
            >
              23 Days
            </Typography>
          </Paper>

          {/* Last Modified Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              padding: "1.5rem",
              border: "1px solid #DADADD",
              borderRadius: "0.5rem",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "0.875rem",
                color: "#666666",
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
                color: "#333333",
              }}
            >
              12 October, 2025
            </Typography>
          </Paper>
        </Box>

        {/* Main Card with Variant Summary and Chart */}
        <Paper
          elevation={0}
          sx={{
            padding: "1.5rem",
            border: "1px solid #DADADD",
            borderRadius: "0.5rem",
            backgroundColor: "#FFFFFF",
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
                  color: "#333333",
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
                        color: "#333333",
                        borderBottom: "1px solid #DADADD",
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
                        color: "#333333",
                        borderBottom: "1px solid #DADADD",
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
                        color: "#333333",
                        borderBottom: "1px solid #DADADD",
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
                          color: "#333333",
                          borderBottom: "1px solid #DADADD",
                          padding: "0.75rem",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                          color: "#333333",
                          borderBottom: "1px solid #DADADD",
                          padding: "0.75rem",
                        }}
                      >
                        {variant.percentage}%
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "Inter",
                          fontSize: "0.875rem",
                          color: "#333333",
                          borderBottom: "1px solid #DADADD",
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
                  color: "#333333",
                  mb: 2,
                }}
              >
                User Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis
                    dataKey="date"
                    stroke="#666666"
                    label={{ value: "Time", position: "insideBottom", offset: -5, style: { fontFamily: "Inter", fontSize: "0.75rem", fill: "#666666" } }}
                    style={{ fontFamily: "Inter", fontSize: "0.75rem" }}
                  />
                  <YAxis
                    stroke="#666666"
                    label={{ value: "Users", angle: -90, position: "insideLeft", style: { fontFamily: "Inter", fontSize: "0.75rem", fill: "#666666" } }}
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
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #DADADD",
                      borderRadius: "0.5rem",
                      fontFamily: "Inter",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontFamily: "Inter", fontSize: "0.875rem" }}
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
  );
}
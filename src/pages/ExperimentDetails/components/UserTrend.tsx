import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartDataPoint } from "../types";

export default function UserTrend({
  chartData,
}: {
  chartData: ChartDataPoint[];
}) {
  const theme = useTheme();
  return (
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
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
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
  );
}

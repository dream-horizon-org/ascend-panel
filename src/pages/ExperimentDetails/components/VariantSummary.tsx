import { Box, Typography, useTheme } from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Variant } from "../types";

export default function VariantSummary({ variants }: { variants: Variant[] }) {
  const theme = useTheme();
  return (
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
  );
}

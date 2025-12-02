import Layout from "../../../components/Layout/Layout";

import { Alert } from "@mui/material";

import { Box } from "@mui/material";

export default function ErrorPage({
  errorMessage,
  severity = "error",
}: {
  errorMessage: string;
  severity?: "error" | "warning" | "info" | "success";
}) {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Alert severity={severity}>{errorMessage}</Alert>
      </Box>
    </Layout>
  );
}

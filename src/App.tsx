import Layout from "./components/Layout/Layout";
import { Typography, Box } from "@mui/material";

function App() {
  return (
    <Layout>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, mb: 2 }}
          color="text.primary"
        >
          Welcome to Ascend
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a tab from the sidebar to navigate
        </Typography>
      </Box>
    </Layout>
  );
}

export default App;

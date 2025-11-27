import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { theme } from "./theme/theme.ts";
import { queryClient } from "./network/queryClient.ts";
import { BrowserRouter, Route, Routes } from "react-router";
import CreateExperiment from "./pages/CreateExperiment";
import ExperimentDetails from "./pages/ExperimentDetails/ExperimentDetails.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/create-experiment" element={<CreateExperiment />} />
              <Route path="/experiment/:id" element={<ExperimentDetails />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);

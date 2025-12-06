import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import { useParams, useLocation } from "react-router";
import { useState } from "react";
import { useExperiment } from "../../network/queries";
import ExperimentDetailsHeader from "../ExperimentDetails/ExperimentDetailsHeader";
import ExperimentDetailsContent from "../ExperimentDetails/components/ExperimentDetailsContent";
import ExperimentDetailsSnackbars from "../ExperimentDetails/components/ExperimentDetailsSnackbars";
import { convertVariantsToDisplay, mapStatus } from "../../utils/helpers";
import ErrorPage from "../ExperimentDetails/components/ErrorPage";
import {
  useConcludeExperiment,
  useTerminateExperiment,
  usePauseExperiment,
  useRestartExperiment,
} from "../../network/mutations";
import { ChartDataPoint, Variant } from "../ExperimentDetails/types";
import SetupTab from "./components/SetupTab";

export default function ExperimentOverview() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const defaultTab = (location.state as { defaultTab?: "setup" | "results" })
    ?.defaultTab;
  const [activeTab, setActiveTab] = useState<"setup" | "results">(
    defaultTab || "setup",
  );

  const { data: experiment, isLoading, error } = useExperiment(id || null);
  const concludeMutation = useConcludeExperiment();
  const terminateMutation = useTerminateExperiment();
  const pauseMutation = usePauseExperiment();
  const restartMutation = useRestartExperiment();

  const [copySuccessOpen, setCopySuccessOpen] = useState(false);

  const { isPending: isConcluding } = concludeMutation;
  const { isPending: isTerminating } = terminateMutation;
  const { isPending: isPausing } = pauseMutation;
  const { isPending: isRestarting } = restartMutation;

  const chartData: ChartDataPoint[] = [];

  const variants: Variant[] = experiment
    ? convertVariantsToDisplay(
        experiment.variants,
        experiment.variantWeights,
        experiment.variantCounts,
      )
    : [];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue === 0 ? "setup" : "results");
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

  const handlePauseExperiment = () => {
    if (id && !isPausing) {
      pauseMutation.mutate({
        id,
        data: { status: "PAUSED" },
      });
    }
  };

  const handleRestartExperiment = () => {
    if (id && !isRestarting) {
      restartMutation.mutate({
        id,
        data: { status: "LIVE" },
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

  const statusInfo = mapStatus(experiment.status);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar - 1,
          backgroundColor: "background.paper",
          flexShrink: 0,
        }}
      >
        <ExperimentDetailsHeader
          title={experiment.name}
          status={statusInfo}
          experimentId={`#${experiment.experimentId}`}
          experimentStatus={experiment.status}
          variants={experiment.variants}
          onBack={() => window.history.back()}
          onCopyId={handleCopyId}
          onTerminateExperiment={handleTerminateExperiment}
          onDeclareWinner={handleDeclareWinner}
          onPauseExperiment={handlePauseExperiment}
          onRestartExperiment={handleRestartExperiment}
        />

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Tabs
            value={activeTab === "setup" ? 0 : 1}
            onChange={handleTabChange}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#0060E5",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#666666",
                padding: "1rem 1.5rem",
                minHeight: "auto",
                "&.Mui-selected": {
                  color: "#0060E5",
                },
              },
            }}
          >
            <Tab label="Setup" />
            <Tab label="Results" />
          </Tabs>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {activeTab === "setup" ? (
          <SetupTab experimentId={id || ""} />
        ) : (
          <ExperimentDetailsContent
            experiment={experiment}
            variants={variants}
            chartData={chartData}
          />
        )}
      </Box>

      <ExperimentDetailsSnackbars
        copySuccessOpen={copySuccessOpen}
        onCopySuccessClose={() => setCopySuccessOpen(false)}
        concludeMutation={concludeMutation}
        terminateMutation={terminateMutation}
      />
    </Box>
  );
}

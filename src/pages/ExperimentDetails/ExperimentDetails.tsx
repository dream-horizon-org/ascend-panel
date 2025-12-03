import { Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";

import ExperimentDetailsHeader from "./ExperimentDetailsHeader";
import ExperimentDetailsContent from "./components/ExperimentDetailsContent";
import ExperimentDetailsSnackbars from "./components/ExperimentDetailsSnackbars";
import { ChartDataPoint, Variant } from "./types";
import { useExperiment } from "../../network/queries";
import {
  useConcludeExperiment,
  useTerminateExperiment,
} from "../../network/mutations";
import { convertVariantsToDisplay, mapStatus } from "../../utils/helpers";
import ErrorPage from "./components/ErrorPage";

export default function ExperimentDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: experiment, isLoading, error } = useExperiment(id || null);

  const concludeMutation = useConcludeExperiment();
  const terminateMutation = useTerminateExperiment();

  // State for copy ID snackbar
  const [copySuccessOpen, setCopySuccessOpen] = useState(false);

  // Extract states from mutations
  const { isPending: isConcluding } = concludeMutation;
  const { isPending: isTerminating } = terminateMutation;

  const chartData: ChartDataPoint[] = [
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

  const statusInfo = mapStatus(experiment.status);

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
      <ExperimentDetailsContent
        experiment={experiment}
        variants={variants}
        chartData={chartData}
      />
      <ExperimentDetailsSnackbars
        copySuccessOpen={copySuccessOpen}
        onCopySuccessClose={() => setCopySuccessOpen(false)}
        concludeMutation={concludeMutation}
        terminateMutation={terminateMutation}
      />
    </Box>
  );
}

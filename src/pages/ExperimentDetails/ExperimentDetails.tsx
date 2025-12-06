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
import AscendModal from "../../components/AscendModal/AscendModal";
import AscendButton from "../../components/AscendButton/AscendButton";

export default function ExperimentDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: experiment, isLoading, error } = useExperiment(id || null);

  const concludeMutation = useConcludeExperiment();
  const terminateMutation = useTerminateExperiment();

  // State for copy ID snackbar
  const [copySuccessOpen, setCopySuccessOpen] = useState(false);

  // State for terminate confirmation modal
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  // Extract states from mutations
  const { isPending: isConcluding } = concludeMutation;
  const { isPending: isTerminating } = terminateMutation;

  const chartData: ChartDataPoint[] = [];

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

  const handleTerminateClick = () => {
    if (id && !isTerminating) {
      setShowTerminateConfirm(true);
    }
  };

  const handleConfirmTerminate = () => {
    if (id) {
      terminateMutation.mutate({
        id,
        data: { status: "TERMINATED" },
      });
    }
    setShowTerminateConfirm(false);
  };

  const handleCancelTerminate = () => {
    setShowTerminateConfirm(false);
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
        onTerminateExperiment={handleTerminateClick}
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

      {/* Terminate Confirmation Modal */}
      <AscendModal
        open={showTerminateConfirm}
        onClose={handleCancelTerminate}
        config={{
          title: "Terminate Experiment",
          description: `Are you sure you want to terminate experiment "${experiment.name}"? This action cannot be undone.`,
          showCloseButton: false,
          width: 450,
          actions: (
            <>
              <AscendButton
                variant="outlined"
                onClick={handleCancelTerminate}
                sx={{ mr: 1 }}
              >
                Cancel
              </AscendButton>
              <AscendButton
                variant="contained"
                color="error"
                onClick={handleConfirmTerminate}
                disabled={isTerminating}
              >
                {isTerminating ? "Terminating..." : "Terminate"}
              </AscendButton>
            </>
          ),
        }}
      />
    </Box>
  );
}

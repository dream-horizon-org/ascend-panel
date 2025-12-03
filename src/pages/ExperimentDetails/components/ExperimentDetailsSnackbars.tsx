import { useMemo } from "react";
import AscendSnackbar from "../../../components/AscendSnackbar/AscendSnackbar";
import { UseMutationResult } from "@tanstack/react-query";
import { ConcludeExperimentResponse } from "../../../network/mutations/concludeExperiment/types";
import { TerminateExperimentResponse } from "../../../network/mutations/terminateExperiment/types";

interface ExperimentDetailsSnackbarsProps {
  copySuccessOpen: boolean;
  onCopySuccessClose: () => void;
  concludeMutation: UseMutationResult<
    ConcludeExperimentResponse,
    Error,
    { id: string | number; data: any }
  >;
  terminateMutation: UseMutationResult<
    TerminateExperimentResponse,
    Error,
    { id: string | number; data: any }
  >;
}

export default function ExperimentDetailsSnackbars({
  copySuccessOpen,
  onCopySuccessClose,
  concludeMutation,
  terminateMutation,
}: ExperimentDetailsSnackbarsProps) {
  const {
    isSuccess: isConcludeSuccess,
    isError: isConcludeError,
    error: concludeError,
  } = concludeMutation;

  const {
    isSuccess: isTerminateSuccess,
    isError: isTerminateError,
    error: terminateError,
  } = terminateMutation;

  const snackbars = useMemo(
    () => [
      {
        open: copySuccessOpen,
        message: "Experiment ID copied to clipboard",
        severity: "success" as const,
        onClose: onCopySuccessClose,
      },
      {
        open: isConcludeSuccess,
        message: "Experiment concluded successfully",
        severity: "success" as const,
        onClose: () => concludeMutation.reset(),
      },
      {
        open: isConcludeError,
        message: concludeError?.message || "Failed to conclude experiment",
        severity: "error" as const,
        onClose: () => concludeMutation.reset(),
      },
      {
        open: isTerminateSuccess,
        message: "Experiment terminated successfully",
        severity: "success" as const,
        onClose: () => terminateMutation.reset(),
      },
      {
        open: isTerminateError,
        message: terminateError?.message || "Failed to terminate experiment",
        severity: "error" as const,
        onClose: () => terminateMutation.reset(),
      },
    ],
    [
      copySuccessOpen,
      onCopySuccessClose,
      isConcludeSuccess,
      isConcludeError,
      concludeError,
      concludeMutation,
      isTerminateSuccess,
      isTerminateError,
      terminateError,
      terminateMutation,
    ],
  );

  return (
    <>
      {snackbars.map((snackbar, index) => (
        <AscendSnackbar key={index} {...snackbar} />
      ))}
    </>
  );
}


import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useMemo, useCallback } from "react";
import { z } from "zod";
import ExperimentForm from "../../CreateExperiment/components/ExperimentForm";
import { experimentSchema } from "../../CreateExperiment/schema";
import { useExperiment } from "../../../network/queries";
import {
  useUpdateExperiment,
  UpdateExperimentRequest,
} from "../../../network/mutations";
import { Experiment } from "../../../network/queries";
import AscendModal from "../../../components/AscendModal/AscendModal";
import AscendSnackbar from "../../../components/AscendSnackbar/AscendSnackbar";

type ExperimentFormData = z.infer<typeof experimentSchema>;

interface EditExperimentFormProps {
  experimentId: string;
  onDiscardConfirm?: () => void;
}

const EditExperimentForm = ({
  experimentId,
}: EditExperimentFormProps) => {
  const editExperimentMutation = useUpdateExperiment();
  const { data: experiment, isLoading: isLoadingExperiment } = useExperiment(
    experimentId || null,
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<ExperimentFormData | null>(null);
  const [resetFormFn, setResetFormFn] = useState<(() => void) | null>(null);

  const handleDiscard = useCallback(() => {
    setDiscardModalOpen(true);
  }, []);

  const handleConfirmDiscard = useCallback(() => {
    setDiscardModalOpen(false);
    if (resetFormFn) {
      resetFormFn();
    }
  }, [resetFormFn]);

  const handleCancelDiscard = useCallback(() => {
    setDiscardModalOpen(false);
  }, []);

  const transformExperimentToFormData = (
    exp: Experiment,
  ): Partial<ExperimentFormData> => {
    const variantKeys = Object.keys(exp.variants || {});
    const variants = variantKeys.map((key) => {
      const variant = exp.variants[key];
      const weight = exp.variantWeights?.weights?.[key];
      const trafficSplit = typeof weight === "number" ? weight.toString() : "0";

      return {
        name: variant.display_name || key,
        trafficSplit: trafficSplit,
        variables: (variant.variables || []).map((v: any) => ({
          key: v.key || "",
          data_type: v.dataType || v.data_type || "",
          value: v.value || "",
        })),
        cohorts:
          typeof weight === "object" && Array.isArray(weight) ? weight : [],
      };
    });

    const isAssignCohortsDirectly = exp.assignmentDomain === "STRATIFIED";
    const filters = exp.ruleAttributes?.[0]?.conditions || [];

    return {
      name: exp.name || "",
      id: exp.key || exp.experimentId || "",
      hypothesis: exp.hypothesis || "",
      description: exp.description || "",
      tags: exp.tags || [],
      rateLimit: exp.exposure ? `${exp.exposure}%` : "100%",
      maxUsers: exp.threshold ? exp.threshold.toString() : "",
      variants:
        variants.length > 0
          ? variants
          : [
              {
                name: "Control Group",
                trafficSplit: "50",
                variables: [{ key: "", data_type: "", value: "" }],
                cohorts: [],
              },
            ],
      targeting: {
        filters: filters.map((f: any) => ({
          operand: f.operand || "",
          operandDataType: f.operandDataType || "",
          operator: f.operator || "",
          value: f.value || "",
          condition: "IF",
        })),
        cohorts: exp.cohorts || [],
        isAssignCohortsDirectly: isAssignCohortsDirectly,
      },
    };
  };

  const transformToEditRequest = (
    data: ExperimentFormData,
  ): UpdateExperimentRequest => {
    const dirty: UpdateExperimentRequest = {};

    const originalDescription = experiment?.description || "";
    if (data.description !== originalDescription) {
      dirty.description = data.description || "";
    }

    const rateLimitValue = data.rateLimit
      ? parseInt(data.rateLimit.replace("%", "")) || 100
      : 100;
    const originalExposure = experiment?.exposure || 100;
    if (rateLimitValue !== originalExposure) {
      dirty.exposure = rateLimitValue;
    }

    if (data.maxUsers && data.maxUsers.trim() !== "") {
      const maxUsersValue = parseInt(data.maxUsers) || 0;
      const originalThreshold = experiment?.threshold || 50000;
      if (maxUsersValue !== originalThreshold) {
        dirty.threshold = maxUsersValue;
      }
    }

    return dirty;
  };

  const handleSubmit = useCallback((data: ExperimentFormData) => {
    setPendingFormData(data);
    setConfirmModalOpen(true);
  }, []);

  const handleConfirmSave = () => {
    if (!experimentId || !pendingFormData) {
      console.error("Experiment ID or form data is missing");
      return;
    }

    const editRequest = transformToEditRequest(pendingFormData);

    editExperimentMutation.mutate(
      {
        id: experimentId,
        data: editRequest,
      },
      {
        onSuccess: (response) => {
          console.log("Experiment updated successfully:", response);
          setConfirmModalOpen(false);
          setPendingFormData(null);
        },
        onError: (error) => {
          console.error("Failed to update experiment:", error);
          setConfirmModalOpen(false);
        },
      },
    );
  };

  const {
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
  } = editExperimentMutation;

  const getErrorMessage = useCallback((error: Error | null): string => {
    if (!error) return "Failed to update experiment";
    const axiosError = error as any;
    if (axiosError?.response?.data?.message) {
      return axiosError.response.data.message;
    }
    return error.message || "Failed to update experiment";
  }, []);

  const snackbars = useMemo(
    () => [
      {
        open: isUpdateSuccess,
        message: "Experiment updated successfully",
        severity: "success" as const,
        onClose: () => editExperimentMutation.reset(),
      },
      {
        open: isUpdateError,
        message: getErrorMessage(updateError),
        severity: "error" as const,
        onClose: () => editExperimentMutation.reset(),
      },
    ],
    [
      isUpdateSuccess,
      isUpdateError,
      updateError,
      getErrorMessage,
    ],
  );

  const handleCancelSave = useCallback(() => {
    setConfirmModalOpen(false);
    setPendingFormData(null);
  }, []);

  const handleResetForm = useCallback(
    (resetFn: () => void) => {
      setResetFormFn(() => resetFn);
    },
    [],
  );

  const confirmModalConfig = useMemo(
    () => ({
      width: 500,
      closeOnBackdropClick: false,
      closeOnEscape: true,
      showCloseButton: false,
      children: (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#333333",
              }}
            >
              Save Changes to Running Experiment?
            </Typography>
            <IconButton
              size="small"
              onClick={handleCancelSave}
              sx={{
                color: "#666666",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "0.875rem",
              color: "#333333",
              mb: 3,
            }}
          >
            Are you sure you want to make this change to the experiment?{" "}
            <Box component="span" sx={{ color: "#666666" }}>
              &lt;the change will affect future users&gt;
            </Box>
          </Typography>
        </Box>
      ),
      actions: (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button
            onClick={handleCancelSave}
            variant="text"
            sx={{
              color: "#0060E5",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.625rem 1.5rem",
              "&:hover": {
                backgroundColor: "rgba(0, 96, 229, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            disabled={editExperimentMutation.isPending}
            sx={{
              backgroundColor: "#0060E5",
              color: "white",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.625rem 2rem",
              borderRadius: "0.5rem",
              "&:hover": {
                backgroundColor: "#0050C5",
              },
              "&:disabled": {
                backgroundColor: "#CCCCCC",
                color: "#666666",
              },
            }}
          >
            {editExperimentMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </Box>
      ),
    }),
    [handleCancelSave, handleConfirmSave, editExperimentMutation.isPending],
  );

  const discardModalConfig = useMemo(
    () => ({
      width: 500,
      closeOnBackdropClick: false,
      closeOnEscape: true,
      showCloseButton: false,
      children: (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#333333",
              }}
            >
              Exit without saving?
            </Typography>
            <IconButton
              size="small"
              onClick={handleCancelDiscard}
              sx={{
                color: "#666666",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "0.875rem",
              color: "#333333",
              mb: 1,
            }}
          >
            Are you sure you want to discard changes to this experiment?
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "0.875rem",
              color: "#666666",
              mb: 3,
            }}
          >
            All unsaved changes will be lost and the form will be reset to the
            original values.
          </Typography>
        </Box>
      ),
      actions: (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button
            onClick={handleCancelDiscard}
            variant="text"
            sx={{
              color: "#0060E5",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.625rem 1.5rem",
              "&:hover": {
                backgroundColor: "rgba(0, 96, 229, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDiscard}
            variant="contained"
            sx={{
              backgroundColor: "#0060E5",
              color: "white",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.625rem 2rem",
              borderRadius: "0.5rem",
              "&:hover": {
                backgroundColor: "#0050C5",
              },
            }}
          >
            Exit
          </Button>
        </Box>
      ),
    }),
    [handleCancelDiscard, handleConfirmDiscard],
  );

  const defaultValues: Partial<ExperimentFormData> = useMemo(() => {
    if (experiment) {
      return transformExperimentToFormData(experiment);
    }
    return {
      name: "",
      id: "",
      hypothesis: "",
      description: "",
      tags: [],
      rateLimit: "100%",
      maxUsers: "",
      variants: [
        {
          name: "Control Group",
          trafficSplit: "50",
          variables: [{ key: "", data_type: "", value: "" }],
          cohorts: [],
        },
      ],
      targeting: {
        filters: [],
        cohorts: [],
        isAssignCohortsDirectly: false,
      },
    };
  }, [experiment]);

  if (isLoadingExperiment) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!experiment) {
    return (
      <Box>
        <Typography>Experiment not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <ExperimentForm
        isEditMode={true}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitButtonText="Save Changes"
        isLoading={editExperimentMutation.isPending}
        onDiscard={handleDiscard}
        onResetForm={handleResetForm}
      />

      <AscendModal
        config={confirmModalConfig}
        open={confirmModalOpen}
        onClose={handleCancelSave}
      />

      <AscendModal
        config={discardModalConfig}
        open={discardModalOpen}
        onClose={handleCancelDiscard}
      />
      {snackbars.map((snackbar, index) => (
        <AscendSnackbar key={index} {...snackbar} />
      ))}
    </Box>
  );
};

export default EditExperimentForm;

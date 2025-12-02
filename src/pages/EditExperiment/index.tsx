import {
  Box,
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router";
import { useState, useMemo } from "react";
import { z } from "zod";
import ExperimentForm from "../CreateExperiment/components/ExperimentForm";
import { experimentSchema } from "../CreateExperiment/schema";
import {
  useEditExperiment,
  useExperiment,
} from "../../network/queries/experiments";
import { UpdateExperimentRequest } from "../../network/mutations/experiments";
import { Experiment } from "../../network/queries/experiments";
import AscendModal from "../../components/AscendModal/AscendModal";

type ExperimentFormData = z.infer<typeof experimentSchema>;

const EditExperiment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editExperimentMutation = useEditExperiment();
  //   const { data: experiment, isLoading: isLoadingExperiment } = useExperiment(id || null);
  const { data: experiment, isLoading: isLoadingExperiment } = {
    data: {
      name: "Test Experiment",
      key: "test-experiment",
      description: "This is a test experiment",
      tags: ["test", "experiment"],
      exposure: 100,
      threshold: 50000,
      experimentId: "123",
      projectKey: "test-project",
      hypothesis: "This is a test hypothesis",
      status: "LIVE",
      type: "A/B",
      assignmentDomain: "STRATIFIED",
      distributionStrategy: "RANDOM",
      guardrailHealthStatus: "PASSED",
      cohorts: ["test-cohort"],
      variantWeights: {
        type: "WEIGHTED",
        weights: {
          "test-variant": 50,
        },
      },
      variants: {
        "test-variant": {
          display_name: "Test Variant",
          variables: [
            { key: "test-variable", dataType: "STRING", value: "test-value" },
          ],
        },
      },
      ruleAttributes: [
        {
          name: "Test Rule",
          conditions: [
            {
              operand: "IF",
              operandDataType: "STRING",
              operator: "EQUALS",
              value: "test-value",
            },
          ],
        },
      ],
      overrides: [],
    },
    isLoading: false,
  };
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<ExperimentFormData | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDiscard = () => {
    // Show discard confirmation modal
    setDiscardModalOpen(true);
  };

  const handleConfirmDiscard = () => {
    // Navigate back after confirmation
    setDiscardModalOpen(false);
    navigate(-1);
  };

  const handleCancelDiscard = () => {
    setDiscardModalOpen(false);
  };

  // Transform experiment data to form data format
  const transformExperimentToFormData = (
    exp: Experiment
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
    data: ExperimentFormData
  ): UpdateExperimentRequest => {
    // Only send description and advance configuration fields (rateLimit -> exposure, maxUsers -> threshold)
    const dirty: UpdateExperimentRequest = {};

    // Check if description changed
    const originalDescription = experiment?.description || "";
    if (data.description !== originalDescription) {
      dirty.description = data.description || "";
    }

    // Map rateLimit to exposure (convert "100%" to 100)
    const rateLimitValue = data.rateLimit
      ? parseInt(data.rateLimit.replace("%", "")) || 100
      : 100;
    const originalExposure = experiment?.exposure || 100;
    if (rateLimitValue !== originalExposure) {
      dirty.exposure = rateLimitValue;
    }

    // Map maxUsers to threshold (convert string to number)
    // Only update if maxUsers is provided and different from original
    if (data.maxUsers && data.maxUsers.trim() !== "") {
      const maxUsersValue = parseInt(data.maxUsers) || 0;
      const originalThreshold = experiment?.threshold || 50000;
      if (maxUsersValue !== originalThreshold) {
        dirty.threshold = maxUsersValue;
      }
    }

    return dirty;
  };

  const handleSubmit = (data: ExperimentFormData) => {
    // Store form data and show confirmation modal
    setPendingFormData(data);
    setConfirmModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (!id || !pendingFormData) {
      console.error("Experiment ID or form data is missing");
      return;
    }

    const editRequest = transformToEditRequest(pendingFormData);

    editExperimentMutation.mutate(
      {
        id: id,
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
      }
    );
  };

  const handleCancelSave = () => {
    setConfirmModalOpen(false);
    setPendingFormData(null);
  };

  // Transform experiment data to form default values
  const defaultValues: Partial<ExperimentFormData> = useMemo(() => {
    if (experiment) {
      return transformExperimentToFormData(experiment as unknown as Experiment);
    }
    // Fallback default values while loading
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
          height: "100vh",
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
      {/* Header with back button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <IconButton onClick={handleBack} aria-label="go back">
          <ArrowBackIcon
            sx={{
              color: "#595959",
              fontSize: "1rem",
            }}
          />
        </IconButton>
        <Typography
          component="h1"
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#333333",
          }}
        >
          Edit Experiment
        </Typography>
      </Box>

      <ExperimentForm
        isEditMode={true}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitButtonText="Save Changes"
        isLoading={editExperimentMutation.isPending}
        onDiscard={handleDiscard}
      />

      {/* Confirmation Modal */}
      <AscendModal
        config={{
          width: 500,
          closeOnBackdropClick: false,
          closeOnEscape: true,
          showCloseButton: false,
          children: (
            <Box>
              {/* Title with Close Button */}
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

              {/* Modal Content */}
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
        }}
        open={confirmModalOpen}
        onClose={handleCancelSave}
      />

      {/* Discard Confirmation Modal */}
      <AscendModal
        config={{
          width: 500,
          closeOnBackdropClick: false,
          closeOnEscape: true,
          showCloseButton: false,
          children: (
            <Box>
              {/* Title with Close Button */}
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

              {/* Modal Content */}
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
                &lt;Discarding this experiment will remove all information
                saved&gt;
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
        }}
        open={discardModalOpen}
        onClose={handleCancelDiscard}
      />
    </Box>
  );
};

export default EditExperiment;

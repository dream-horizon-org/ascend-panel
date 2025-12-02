import { Box, IconButton, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { z } from "zod";
import ExperimentForm from "../CreateExperiment/components/ExperimentForm";
import { experimentSchema } from "../CreateExperiment/schema";
import { useEditExperiment } from "../../network/queries/experiments";
import { EditExperimentRequest } from "../../network/mutations/experiments";
import AscendModal from "../../components/AscendModal/AscendModal";

type ExperimentFormData = z.infer<typeof experimentSchema>;

const EditExperiment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editExperimentMutation = useEditExperiment();
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

  const transformToEditRequest = (
    data: ExperimentFormData
  ): EditExperimentRequest => {
    const isAssignCohortsDirectly =
      data.targeting?.isAssignCohortsDirectly || false;
    const assignmentType = isAssignCohortsDirectly ? "STRATIFIED" : "COHORT";

    const variants: Record<
      string,
      {
        display_name: string;
        variables: Array<{
          data_type: string;
          value: string;
          key: string;
        }>;
      }
    > = {};

    data.variants.forEach((variant, index) => {
      const key = index === 0 ? "control" : `variant${index}`;

      const variables = variant.variables
        .filter((v) => v.key && v.data_type)
        .map((v) => ({
          key: v.key,
          value: v.value,
          data_type: v.data_type,
        }));

      variants[key] = {
        display_name: variant.name,
        variables: variables,
      };
    });

    const rule_attributes =
      data.targeting?.filters && data.targeting.filters.length > 0
        ? [
            {
              name: "Targeting Rule",
              conditions: data.targeting.filters.map(
                ({ operand, operandDataType, operator, value }) => ({
                  operand,
                  operandDataType,
                  operator,
                  value,
                })
              ),
            },
          ]
        : [];

    return {
      name: data.name,
      experiment_key: data.id,
      metrics: {
        primary: [],
        secondary: [],
      },
      tags: data.tags || [],
      owner: [],
      description: data.description || "",
      hypothesis: data.hypothesis,
      status: "LIVE",
      type: "A_B",
      assignment_domain: assignmentType,
      distribution_strategy: "RANDOM",
      guardrail_health_status: "PASSED",
      cohorts: data.targeting?.cohorts || [],
      variant_weights: {
        type: assignmentType,
      },
      variants: variants,
      rule_attributes: rule_attributes,
      overrides: [],
      winning_variant: {
        variant_name: "",
      },
      exposure: 100,
      threshold: 50000,
      start_time: Math.floor(Date.now() / 1000),
      end_time: Math.floor(Date.now() / 1000) + 86400 * 30,
      updated_by: "user@example.com",
    };
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

  const defaultValues: Partial<ExperimentFormData> = {
    name: "IPL 2024 Experiment",
    id: "ipl_2024_experiment",
    hypothesis:
      "The hypothesis written by the user will come here and will take up as much space as it needs. Max 120 char limit",
    description:
      "The description written by the user will come here and will take up as much space as it needs. We should have a 300 character limit on the description.",
    tags: ["Label", "Label"],
    rateLimit: "100%",
    maxUsers: "",
    variants: [
      {
        name: "Control Group",
        trafficSplit: "50",
        variables: [{ key: "", data_type: "", value: "" }],
        cohorts: [],
      },
      {
        name: "Variant 1",
        trafficSplit: "50",
        variables: [{ key: "", data_type: "", value: "" }],
        cohorts: [],
      },
    ],
    targeting: {
      filters: [
        {
          operand: "app_version",
          operandDataType: "STRING",
          operator: "!=",
          value: "88.88.88",
          condition: "IF",
        },
      ],
      cohorts: ["Tag1"],
      isAssignCohortsDirectly: false,
    },
  };

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

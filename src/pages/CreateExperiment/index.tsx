import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import {
  useCreateExperiment,
  transformToRequestBody,
} from "../../network/mutations/createExperiment";
import ExperimentForm from "./components/ExperimentForm";
import { experimentSchema } from "./schema";
import AscendSnackbar from "../../components/AscendSnackbar/AscendSnackbar";

type ExperimentFormData = z.infer<typeof experimentSchema>;

const CreateExperiment = () => {
  const navigate = useNavigate();
  const createExperimentMutation = useCreateExperiment();
  const [showCreatingSnackbar, setShowCreatingSnackbar] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = (data: ExperimentFormData) => {
    setShowCreatingSnackbar(true);

    const requestBody = transformToRequestBody(data);
    createExperimentMutation.mutate(requestBody, {
      onSuccess: (response) => {
        setShowCreatingSnackbar(false);
        setTimeout(() => {
          navigate(`/experiment/${response.experiment_id}`, { 
            replace: true,
            state: { defaultTab: "results" }
          });
        }, 2000);
      },
      onError: () => {
        setShowCreatingSnackbar(false);
      },
    });
  };

  const {
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError,
  } = createExperimentMutation;

  const getErrorMessage = (error: Error | null): string => {
    if (!error) return "Failed to create experiment";
    // Handle axios error structure
    const axiosError = error as any;
    if (axiosError?.response?.data?.error?.message) {
      return axiosError.response.data.error.message;
    }
    return error.message || "Failed to create experiment";
  };

  const snackbars = useMemo(
    () => [
      {
        open: showCreatingSnackbar,
        message: "Creating experiment...",
        severity: "info" as const,
        onClose: () => setShowCreatingSnackbar(false),
        autoHideDuration: null, // Don't auto-hide while creating
      },
      {
        open: isCreateSuccess,
        message: "Experiment created successfully",
        severity: "success" as const,
        onClose: () => createExperimentMutation.reset(),
      },
      {
        open: isCreateError,
        message: getErrorMessage(createError),
        severity: "error" as const,
        onClose: () => createExperimentMutation.reset(),
      },
    ],
    [
      showCreatingSnackbar,
      isCreateSuccess,
      isCreateError,
      createError,
      createExperimentMutation,
    ],
  );

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
          New Experiment
        </Typography>
      </Box>

      <ExperimentForm
        isEditMode={false}
        onSubmit={onSubmit}
        submitButtonText="Create Experiment"
        isLoading={createExperimentMutation.isPending}
      />
      {snackbars.map((snackbar, index) => (
        <AscendSnackbar key={index} {...snackbar} />
      ))}
    </Box>
  );
};

export default CreateExperiment;

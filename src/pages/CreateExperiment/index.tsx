import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import { z } from "zod";
import {
  useCreateExperiment,
  transformToRequestBody,
} from "../../network/mutations/createExperiment";
import ExperimentForm from "./components/ExperimentForm";
import { experimentSchema } from "./schema";

type ExperimentFormData = z.infer<typeof experimentSchema>;

const CreateExperiment = () => {
  const navigate = useNavigate();
  const createExperimentMutation = useCreateExperiment();

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = (data: ExperimentFormData) => {
    const requestBody = transformToRequestBody(data);
    createExperimentMutation.mutate(requestBody, {
      onSuccess: (response) => {
        navigate(`/experiment/${response.experiment_id}`);
      },
    });
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
          New Experiment
        </Typography>
      </Box>

      <ExperimentForm
        isEditMode={false}
        onSubmit={onSubmit}
        submitButtonText="Create Experiment"
      />
    </Box>
  );
};

export default CreateExperiment;

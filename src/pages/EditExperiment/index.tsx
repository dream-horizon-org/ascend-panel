import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import { z } from "zod";
import ExperimentForm from "../CreateExperiment/components/ExperimentForm";
import { experimentSchema } from "../CreateExperiment/schema";

type ExperimentFormData = z.infer<typeof experimentSchema>;

const EditExperiment = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (data: ExperimentFormData) => {
    console.log("Form submitted:", data);
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
      />
    </Box>
  );
};

export default EditExperiment;

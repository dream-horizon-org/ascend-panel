import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router";
import EditExperimentForm from "./components/EditExperimentForm";

const EditExperiment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    navigate(-1);
  };

  const handleDiscardConfirm = () => {
    navigate(-1);
  };

  if (!id) {
    return (
      <Box>
        <Typography>Experiment ID is missing</Typography>
      </Box>
    );
  }

  return (
    <Box>
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

      <EditExperimentForm
        experimentId={id}
        onDiscardConfirm={handleDiscardConfirm}
      />
    </Box>
  );
};

export default EditExperiment;

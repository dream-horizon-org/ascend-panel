
import { Box, IconButton, Typography, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import AscendTextFieldControlled from '../../components/AscendTextField/AscendTextFieldControlled'
import VariantsFlow from './components/VariantsFlow'

// Form validation schema
const experimentSchema = z.object({
  experimentName: z.string().min(1, "Experiment name is required"),
  experimentId: z.string().min(1, "Experiment ID is required"),
  hypothesis: z
    .string()
    .min(1, "Hypothesis is required")
    .max(120, "Maximum 120 characters allowed"),
  description: z.string().max(300, "Maximum 300 characters allowed").optional(),
  rateLimit: z.string().optional(),
  maxUsers: z.string().optional(),
  variants: z.array(z.object({
    name: z.string().min(1, "Variant name is required"),
    trafficSplit: z.string(),
    keyValues: z.array(z.object({
      key: z.string(),
      type: z.string(),
      value: z.string(),
    }))
  })),
});

type ExperimentFormData = z.infer<typeof experimentSchema>;

const CreateExperiment = () => {
  const navigate = useNavigate();
  const [submittedData, setSubmittedData] = useState<ExperimentFormData | null>(null);

  const { control, handleSubmit } = useForm<ExperimentFormData>({
    resolver: zodResolver(experimentSchema),
    mode: "onSubmit", // Validate only on submit
    defaultValues: {
      experimentName: "IPL 2024 Experiment",
      experimentId: "IPL-2024-Experiment",
      hypothesis:
        "The hypothesis written by the user will come here and will take up as much space as it needs. Max 120 char limit",
      description:
        "The description written by the user will come here and will take up as much space as it needs. We should have a 300 character limit on the description.",
      rateLimit: "100%",
      maxUsers: "",
      variants: [
        {
          name: 'Control Group',
          trafficSplit: '50',
          keyValues: [
            { key: '', type: '', value: 'blue' },
          ]
        },
        {
          name: 'Variant 1',
          trafficSplit: '50',
          keyValues: [
            { key: '', type: '', value: '' },
          ]
        },
      ],
    },
  });

  // Watch all form values and log changes
  // const formValues = watch();

  // useEffect(() => {
  //   console.log("Form values changed:", formValues);
  // }, [formValues]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const onSubmit = (data: ExperimentFormData) => {
    setSubmittedData(data);
    console.log('Form submitted:', data);
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
            fontSize: "1rem", // 16px
            color: "#333333",
          }}
        >
          New Experiment
        </Typography>
      </Box>

      {/* Page content */}
      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            padding: "1.5rem", // 24px
            border: "1px solid",
            borderColor: "#DADADD",
            borderRadius: "0.5rem", // 8px
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem", // 16px
                color: "#333333",
              }}
            >
              Experiment Details
            </Typography>
            <InfoOutlinedIcon
              sx={{
                width: "1rem", // 8px
                height: "1rem", // 8px
                color: "#DADADA",
              }}
            />
          </Box>

          {/* Input Fields */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <AscendTextFieldControlled
              name="experimentName"
              control={control}
              label="Experiment Name"
              placeholder="Enter Experiment Name"
              infoText="Provide a unique name for your experiment"
            />
            <AscendTextFieldControlled
              name="experimentId"
              control={control}
              label="Experiment ID"
              placeholder="Enter experiment id"
              infoText="Unique identifier for the experiment"
            />
          </Box>

          {/* Hypothesis Field */}
          <Box sx={{ mt: "1.5rem" }}>
            <AscendTextFieldControlled
              name="hypothesis"
              control={control}
              label="Hypothesis"
              placeholder="Enter hypothesis"
              infoText="Describe the hypothesis for this experiment"
            />
          </Box>

          {/* Description Field */}
          <Box sx={{ mt: "1.5rem" }}>
            <AscendTextFieldControlled
              name="description"
              control={control}
              label="Description (optional)"
              placeholder="Enter description"
              height="120px"
            />
          </Box>
        </Box>

        {/* Variants and Targeting Section */}
        <Box
          sx={{
            padding: "1.5rem", // 24px
            border: "1px solid",
            borderColor: "#DADADD",
            borderRadius: "0.5rem", // 8px
            mt: "1.5rem", // 24px gap from previous box
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem", // 16px
                color: "#333333",
              }}
            >
              Variants and Targeting
            </Typography>
            <InfoOutlinedIcon
              sx={{
                width: "1rem",
                height: "1rem",
                color: "#DADADA",
              }}
            />
          </Box>

          {/* Variants Flow */}
          <VariantsFlow control={control} />
        </Box>

        {/* Advance Configuration Section */}
        <Box
          sx={{
            padding: "1.5rem", // 24px
            border: "1px solid",
            borderColor: "#DADADD",
            borderRadius: "0.5rem", // 8px
            mt: "1.5rem", // 24px gap from previous box
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem", // 16px
                color: "#333333",
              }}
            >
              Advance Configuration
            </Typography>
            <InfoOutlinedIcon
              sx={{
                width: "1rem",
                height: "1rem",
                color: "#DADADA",
              }}
            />
          </Box>

          {/* Rate Limiting Field */}
          <Box>
            <AscendTextFieldControlled
              name="rateLimit"
              control={control}
              label="Rate Limiting (optional)"
              placeholder="Enter rate"
              infoText="Set the maximum rate limit for this experiment"
              width="10%"
            />
          </Box>

          {/* Maximum Users Field */}
          <Box sx={{ mt: "1.5rem" }}>
            <AscendTextFieldControlled
              name="maxUsers"
              control={control}
              label="Maximum Users (optional)"
              placeholder="######"
              infoText="Set the maximum number of users for this experiment"
              width="10%"
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: "2rem", display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
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
            Create Experiment
          </Button>
        </Box>

        {/* Display Submitted Data */}
        {submittedData && (
          <Box
            sx={{
              mt: "2rem",
              padding: "1.5rem",
              border: "1px solid #DADADD",
              borderRadius: "0.5rem",
              backgroundColor: "#F9F9F9",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#333333",
                mb: "1rem",
              }}
            >
              Submitted Form Data
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "0.5rem",
                overflow: "auto",
                maxHeight: "400px",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                border: "1px solid #E0E0E0",
              }}
            >
              {JSON.stringify(submittedData, null, 2)}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CreateExperiment;

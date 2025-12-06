import { Box, Typography, Button, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef, useMemo } from "react";
import AscendTextFieldControlled from "../../../components/AscendTextField/AscendTextFieldControlled";
import VariantsFlow from "./VariantsFlow";
import AscendAutoCompleteControlled from "../../../components/AscendAutoComplete/AscendAutoCompleteControlled";
import { experimentSchema } from "../schema";
import { useTags } from "../../../network";

type ExperimentFormData = z.infer<typeof experimentSchema>;

const sections = [
  { id: "experiment-details", label: "Experiment Details" },
  { id: "variants-targeting", label: "Variants & Targeting" },
  { id: "advanced-configuration", label: "Advanced Configuration" },
];

interface ExperimentFormProps {
  isEditMode?: boolean;
  defaultValues?: Partial<ExperimentFormData>;
  onSubmit: (data: ExperimentFormData) => void;
  onNameChange?: (value: string) => void;
  submitButtonText?: string;
  isLoading?: boolean;
  onDiscard?: () => void;
  onResetForm?: (resetFn: () => void) => void;
}

const ExperimentForm = ({
  isEditMode = false,
  defaultValues,
  onSubmit,
  onNameChange,
  submitButtonText = "Create Experiment",
  isLoading = false,
  onDiscard,
  onResetForm,
}: ExperimentFormProps) => {
  const { data: tags = [] } = useTags();

  const [currentSection, setCurrentSection] =
    useState<string>("experiment-details");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<ExperimentFormData>({
    resolver: zodResolver(experimentSchema),
    mode: "onChange",
    defaultValues: defaultValues || {
      name: "",
      id: "",
      hypothesis: "",
      description: "",
      tags: [],
      rateLimit: "100",
      maxUsers: "",
      variants: [
        {
          name: "Control Group",
          trafficSplit: "50",
          variables: [{ key: "", data_type: "", value: "" }],
          cohorts: "",
        },
        {
          name: "Variant 1",
          trafficSplit: "50",
          variables: [{ key: "", data_type: "", value: "" }],
          cohorts: "",
        },
      ],
      targeting: {
        filters: [
          {
            operand: "",
            operandDataType: "",
            operator: "",
            value: "",
            condition: "IF",
          },
        ],
        cohorts: "",
        isAssignCohortsDirectly: false,
      },
    },
  });

  // Watch form fields for change detection
  const watchedName = watch("name");
  const watchedId = watch("id");
  const watchedDescription = watch("description");
  const watchedRateLimit = watch("rateLimit");
  const watchedMaxUsers = watch("maxUsers");

  const hasChanges = useMemo(() => {
    if (isEditMode) {
      // For edit mode: check if editable fields have changed from defaultValues
      if (!defaultValues) return true;

      const currentDescription = watchedDescription || "";
      const originalDescription = defaultValues.description || "";

      const currentRateLimit = watchedRateLimit || "100%";
      const originalRateLimit = defaultValues.rateLimit || "100%";
      // Normalize rateLimit for comparison (remove % if present)
      const normalizeRateLimit = (value: string) => {
        return value.replace("%", "").trim();
      };

      const currentMaxUsers = watchedMaxUsers || "";
      const originalMaxUsers = defaultValues.maxUsers || "";

      // Check if any editable field has changed
      const descriptionChanged = currentDescription !== originalDescription;
      const rateLimitChanged =
        normalizeRateLimit(currentRateLimit) !==
        normalizeRateLimit(originalRateLimit);
      const maxUsersChanged = currentMaxUsers !== originalMaxUsers;

      return descriptionChanged || rateLimitChanged || maxUsersChanged;
    } else {
      // For create mode: check if required fields have meaningful data
      // The form starts with default variants, so we only need to check required fields
      const hasName = watchedName && watchedName.trim() !== "";
      const hasId = watchedId && watchedId.trim() !== "";

      // Form has changes if all required fields are filled
      return hasName && hasId;
    }
  }, [
    isEditMode,
    defaultValues,
    watchedName,
    watchedId,
    watchedDescription,
    watchedRateLimit,
    watchedMaxUsers,
  ]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        sectionRefs.current[id] = element;
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Expose reset function to parent component
  useEffect(() => {
    if (onResetForm && defaultValues) {
      const resetForm = () => {
        reset(defaultValues as ExperimentFormData);
      };
      onResetForm(resetForm);
    }
  }, [onResetForm, defaultValues, reset]);

  const handleSidebarClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNameChange = (value: string) => {
    if (onNameChange) {
      onNameChange(value);
    } else if (!isEditMode) {
      // Auto-generate id from name in create mode
      const generatedId = value.replace(/\s+/g, "_").toLowerCase();
      setValue("id", generatedId, { shouldValidate: true });
    }
  };

  const handleFormSubmit = (data: ExperimentFormData) => {
    onSubmit(data);
  };

  return (
    <Box sx={{ display: "flex", position: "relative", alignItems: "flex-start" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "240px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          padding: "2rem 1rem",
          backgroundColor: "background.paper",
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {sections.map((section) => (
            <Box
              key={section.id}
              sx={{
                display: "flex",
                alignItems: "stretch",
              }}
            >
              {/* Left Border Indicator */}
              <Box
                sx={{
                  width: "0.5rem",
                  backgroundColor:
                    currentSection === section.id ? "#0060E5" : "transparent",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                }}
              />
              {/* Content Container */}
              <Box
                onClick={() => handleSidebarClick(section.id)}
                sx={{
                  flex: 1,
                  padding: "0.625rem 1rem",
                  cursor: "pointer",
                  borderRadius: "0.25rem",
                  transition: "all 0.2s ease",
                  backgroundColor:
                    currentSection === section.id ? "#EBF3FE" : "transparent",
                  "&:hover": {
                    backgroundColor:
                      currentSection === section.id ? "#EBF3FE" : "#F5F5F5",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    color:
                      currentSection === section.id ? "#0060E5" : "#595959",
                    transition: "color 0.2s ease",
                  }}
                >
                  {section.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Page content */}
      <Box sx={{ flex: 1, padding: 3 }}>
        <Box
          id="experiment-details"
          sx={{
            padding: "1.5rem",
            border: "1px solid",
            borderColor: "#DADADD",
            borderRadius: "0.5rem",
            scrollMarginTop: "2rem",
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#333333",
              }}
            >
              Experiment Details
            </Typography>
            <Tooltip
              title="Configure basic experiment information including name, key, hypothesis, description, and tags"
              arrow
              placement="top"
            >
              <InfoOutlinedIcon
                sx={{
                  width: "1rem",
                  height: "1rem",
                  color: "#DADADA",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Box>

          {/* Input Fields */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <AscendTextFieldControlled
              name="name"
              control={control}
              label="Experiment Name"
              placeholder="Enter Experiment Name"
              infoText="Provide a unique name for your experiment"
              onChangeCustom={handleNameChange}
              disabled={isEditMode}
              required
            />
            <AscendTextFieldControlled
              name="id"
              control={control}
              label="Experiment Key"
              placeholder="Enter experiment Key"
              infoText="Unique identifier for the experiment"
              disabled={isEditMode}
              required
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
              disabled={isEditMode}
            />
          </Box>

          {/* Description Field */}
          <Box sx={{ mt: "1.5rem" }}>
            <AscendTextFieldControlled
              name="description"
              control={control}
              label="Description"
              placeholder="Enter description"
              height="120px"
            />
          </Box>

          {/* Tags Field */}
          <Box sx={{ mt: "1.5rem" }}>
            <AscendAutoCompleteControlled
              name="tags"
              freeSolo
              control={control}
              label="Tags"
              placeholder={isEditMode ? "" : "Select tags"}
              options={tags}
              multiple
              filterSelectedOptions
              disabled={isEditMode}
              chipStyles={{
                backgroundColor: "#E1E3EA",
                border: "none",
                borderRadius: 0,
                height: "24px",
                fontSize: "0.75rem",
                "& .MuiChip-label": {
                  padding: "0 8px",
                },
                "& .MuiChip-deleteIcon": {
                  color: "#666666",
                  fontSize: "0.875rem",
                  margin: "0 4px 0 -4px",
                  "&:hover": {
                    color: "#333333",
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Variants and Targeting Section */}
        <Box
          id="variants-targeting"
          sx={{
            padding: "1.5rem",
            border: "1px solid",
            borderColor: "#DADADD",
            borderRadius: "0.5rem",
            mt: "1.5rem",
            scrollMarginTop: "2rem",
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#333333",
              }}
            >
              Variants and Targeting
            </Typography>
            <Tooltip
              title="Set up experiment variants with traffic splits and define targeting rules for user segmentation"
              arrow
              placement="top"
            >
              <InfoOutlinedIcon
                sx={{
                  width: "1rem",
                  height: "1rem",
                  color: "#DADADA",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Box>

          {/* Variants Flow */}
          <VariantsFlow control={control} isEditMode={isEditMode} />
        </Box>

        {/* Advance Configuration Section */}
        <Box
          id="advanced-configuration"
          sx={{
            padding: "1.5rem",
            border: "1px solid",
            borderColor: "#DADADD",
            borderRadius: "0.5rem",
            mt: "1.5rem",
            scrollMarginTop: "2rem",
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#333333",
              }}
            >
              Advance Configuration
            </Typography>
            <Tooltip
              title="Configure advanced settings like rate limiting and maximum users for the experiment"
              arrow
              placement="top"
            >
              <InfoOutlinedIcon
                sx={{
                  width: "1rem",
                  height: "1rem",
                  color: "#DADADA",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Box>

          {/* Rate Limiting Field */}
          <Box>
            <AscendTextFieldControlled
              name="rateLimit"
              control={control}
              label="Rate Limiting"
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
              label="Maximum Users"
              placeholder="######"
              infoText="Set the maximum number of users for this experiment"
              width="10%"
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            mt: "2rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          {isEditMode ? (
            <>
              <Button
                variant="text"
                onClick={onDiscard}
                disabled={isLoading || !hasChanges}
                sx={{
                  color: "#0060E5",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0.625rem 2rem",
                  "&:hover": {
                    backgroundColor: "rgba(0, 96, 229, 0.05)",
                  },
                  "&:disabled": {
                    color: "#CCCCCC",
                  },
                }}
              >
                Discard Changes
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit(handleFormSubmit)}
                disabled={isLoading || !hasChanges}
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
                {isLoading ? "Saving..." : submitButtonText}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={handleSubmit(handleFormSubmit)}
                disabled={isLoading || !hasChanges || !isValid}
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
                {isLoading ? "Saving..." : submitButtonText}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ExperimentForm;

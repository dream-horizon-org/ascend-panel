import { Box, Typography, Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
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
}

const ExperimentForm = ({
  isEditMode = false,
  defaultValues,
  onSubmit,
  onNameChange,
  submitButtonText = "Create Experiment",
  isLoading = false,
  onDiscard,
}: ExperimentFormProps) => {
  const { data: tags = [] } = useTags();
  const [submittedData, setSubmittedData] = useState<ExperimentFormData | null>(
    null,
  );
  const [currentSection, setCurrentSection] =
    useState<string>("experiment-details");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const [requestBody, setRequestBody] = useState<any>(null);

  const { control, handleSubmit, setValue, getValues } =
    useForm<ExperimentFormData>({
      resolver: zodResolver(experimentSchema),
      mode: "onSubmit",
      defaultValues: defaultValues || {
        name: "",
        id: "",
        hypothesis:
          "",
        description:
          "",
        tags: [],
        rateLimit: "100",
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
              value: "12.3",
              condition: "IF",
            },
          ],
          cohorts: [],
          isAssignCohortsDirectly: false,
        },
      },
    });

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
      setValue("id", generatedId, { shouldValidate: false });
    }
  };

  const transformToRequestBody = (data: ExperimentFormData) => {
    const isAssignCohortsDirectly =
      data.targeting?.isAssignCohortsDirectly || false;
    const assignmentType = isAssignCohortsDirectly ? "STRATIFIED" : "COHORT";

    const weights: Record<string, number | string[]> = {};
    data.variants.forEach((variant, index) => {
      const key = index === 0 ? "control" : `variant${index}`;
      if (assignmentType === "STRATIFIED") {
        weights[key] = variant.cohorts || [];
      } else {
        weights[key] = parseInt(variant.trafficSplit) || 0;
      }
    });

    const variants: Record<string, any> = {};
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
        displayName: variant.name,
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
                }),
              ),
            },
          ]
        : [];

    const cohorts = data.targeting?.cohorts || [];

    return {
      name: data.name,
      description: data.description || "",
      hypothesis: data.hypothesis,
      status: "LIVE",
      type: "A_B",
      guardrail_health_status: "PASSED",
      cohorts: cohorts,
      variant_weights: {
        type: assignmentType,
        weights: weights,
      },
      variants: variants,
      distribution_strategy: "RANDOM",
      assignment_domain: assignmentType,
      rule_attributes: rule_attributes,
      exposure: 100,
      threshold: 50000,
      start_time: Math.floor(Date.now() / 1000),
      end_time: Math.floor(Date.now() / 1000) + 86400 * 30,
      created_by: "user@example.com",
      tags: data.tags || [],
      owner: [],
      metrics: {
        primary: [],
        secondary: [],
      },
    };
  };

  const handlePreviewRequestBody = () => {
    const formData = getValues();
    const apiRequestBody = transformToRequestBody(formData);
    setRequestBody(apiRequestBody);
    console.log("API Request Body:", apiRequestBody);
  };

  const handleFormSubmit = (data: ExperimentFormData) => {
    setSubmittedData(data);
    onSubmit(data);
  };

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "240px",
          position: "sticky",
          top: 0,
          height: "100vh",
          padding: "2rem 1rem",
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
            <InfoOutlinedIcon
              sx={{
                width: "1rem",
                height: "1rem",
                color: "#DADADA",
              }}
            />
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
            />
            <AscendTextFieldControlled
              name="id"
              control={control}
              label="Experiment ID"
              placeholder="Enter experiment id"
              infoText="Unique identifier for the experiment"
              disabled={isEditMode}
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
              label="Description (optional)"
              placeholder="Enter description"
              height="120px"
            />
          </Box>

          {/* Tags Field */}
          <Box sx={{ mt: "1.5rem" }}>
            <AscendAutoCompleteControlled
              name="tags"
              control={control}
              label="Tags (optional)"
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
            <InfoOutlinedIcon
              sx={{
                width: "1rem",
                height: "1rem",
                color: "#DADADA",
              }}
            />
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                variant="outlined"
                onClick={handlePreviewRequestBody}
                sx={{
                  borderColor: "#0060E5",
                  color: "#0060E5",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0.625rem 2rem",
                  borderRadius: "0.5rem",
                  "&:hover": {
                    borderColor: "#0050C5",
                    backgroundColor: "rgba(0, 96, 229, 0.05)",
                  },
                }}
              >
                Preview Request Body
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit(handleFormSubmit)}
                disabled={isLoading}
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

        {/* Display Request Body */}
        {requestBody && (
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
              API Request Body
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "0.5rem",
                overflow: "auto",
                maxHeight: "600px",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                border: "1px solid #E0E0E0",
              }}
            >
              {JSON.stringify(requestBody, null, 2)}
            </Box>
          </Box>
        )}

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

export default ExperimentForm;

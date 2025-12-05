import { ReactFlow, Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  InputAdornment,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Remove as RemoveIcon } from "@mui/icons-material";
import {
  Control,
  useFieldArray,
  useController,
  Controller,
} from "react-hook-form";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import AscendModal from "../../../components/AscendModal/AscendModal";
import CloseIcon from "@mui/icons-material/Close";
import AscendDropdown from "../../../components/AscendDropdown/AscendDropdown";

// Custom node for Targeting
const TargetingNode = ({ data }: any) => {
  const isEditMode = data.isEditMode || false;
  return (
    <Box
      sx={{
        border: "1px solid #DADADD",
        borderRadius: "0.5rem",
        padding: "1rem",
        backgroundColor: "white",
        minWidth: "180px",
        ...(isEditMode && {
          opacity: 0.6,
        }),
        cursor: "pointer",
      }}
      onClick={() => {
        data.onClick?.();
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#333333",
          }}
        >
          Targeting
        </Box>
        {!isEditMode && (
          <EditIcon
            sx={{ fontSize: "0.875rem", color: "#666666", cursor: "pointer" }}
          />
        )}
      </Box>
      <Box sx={{ fontFamily: "Inter", fontSize: "0.875rem", color: "#666666" }}>
        {data.label}
      </Box>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </Box>
  );
};

// Custom node for Traffic Split
const TrafficSplitNode = ({ data }: any) => {
  const isEditMode = data.isEditMode || false;
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

      <TextField
        size="small"
        type="text"
        value={data.percentage || ""}
        onChange={(e) => {
          if (!isEditMode) {
            data.onChange?.(e.target.value);
          }
        }}
        onBlur={() => {
          if (!isEditMode) {
            data.onBlur?.();
          }
        }}
        disabled={isEditMode}
        placeholder="0"
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        sx={{ width: "80px" }}
      />

      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </Box>
  );
};

// Custom node for Variant
const VariantNode = ({ data }: any) => {
  const isEditMode = data.isEditMode || false;
  const variables = data.variables || [{ key: "", data_type: "", value: "" }];
  const [jsonModalOpen, setJsonModalOpen] = useState<number | null>(null);
  const [tempJsonValue, setTempJsonValue] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState<boolean>(true);

  const validateJson = (value: string) => {
    if (!value || value.trim() === "") {
      setIsValidJson(false);
      return false;
    }

    try {
      JSON.parse(value);
      setIsValidJson(true);
      return true;
    } catch (error) {
      setIsValidJson(false);
      return false;
    }
  };

  const handleOpenJsonModal = (index: number, currentValue: string) => {
    setTempJsonValue(currentValue || "");
    validateJson(currentValue || "");
    setJsonModalOpen(index);
  };

  const handleJsonValueChange = (value: string) => {
    setTempJsonValue(value);
    validateJson(value);
  };

  const handleSaveJson = (index: number) => {
    if (isValidJson) {
      data.onVariableChange?.(index, "value", tempJsonValue);
      setJsonModalOpen(null);
      setTempJsonValue("");
    }
  };

  const handleCancelJson = () => {
    setJsonModalOpen(null);
    setTempJsonValue("");
    setIsValidJson(true);
  };

  return (
    <Box
      sx={{
        borderTopRightRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
        paddingLeft: "0.5rem",
        paddingRight: "1rem",
        borderLeft: "4px solid #0060E526",
        minWidth: "350px",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

      {/* Variant Name Row */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <TextField
          placeholder="Variant Name"
          size="small"
          value={data.name || ""}
          onChange={(e) => {
            if (!isEditMode) {
              data.onNameChange?.(e.target.value);
            }
          }}
          disabled={isEditMode}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" },
          }}
        />
        {data.canDelete && !isEditMode ? (
          <IconButton
            size="small"
            sx={{ color: "#828592", width: 40, height: 40, flexShrink: 0 }}
            onClick={() => data.onDeleteVariant?.()}
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        ) : (
          <Box sx={{ width: 40, height: 40, flexShrink: 0 }} />
        )}
      </Box>

      {/* Multiple Variable Rows */}
      {variables.map((variable: any, index: number) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            mb: index < variables.length - 1 ? 1 : 0,
          }}
        >
          <TextField
            size="small"
            placeholder="Key"
            value={variable.key || ""}
            onChange={(e) => {
              if (!isEditMode) {
                data.onVariableChange?.(index, "key", e.target.value);
              }
            }}
            disabled={isEditMode}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" },
            }}
          />
          <Select
            size="small"
            value={variable.data_type || ""}
            onChange={(e) => {
              if (!isEditMode) {
                data.onVariableChange?.(index, "data_type", e.target.value);
              }
            }}
            disabled={isEditMode}
            displayEmpty
            renderValue={(selected) => {
              if (!selected || selected === "") {
                return <Box sx={{ color: "#999999" }}>Type</Box>;
              }
              // Display friendly names for API values
              const displayNames: Record<string, string> = {
                BOOL: "Boolean",
                NUMBER: "Number",
                DECIMAL: "Decimal",
                STRING: "String",
                SEMVER_STRING: "Semver",
                OBJECT: "Object",
                LIST: "List",
              };
              return displayNames[selected] || selected;
            }}
            sx={{ width: "120px", borderRadius: "0.25rem" }}
          >
            <MenuItem value="BOOL">Boolean</MenuItem>
            <MenuItem value="NUMBER">Number</MenuItem>
            <MenuItem value="DECIMAL">Decimal</MenuItem>
            <MenuItem value="STRING">String</MenuItem>
            <MenuItem value="SEMVER_STRING">Semver</MenuItem>
            <MenuItem value="OBJECT">Object</MenuItem>
            <MenuItem value="LIST">List</MenuItem>
          </Select>
          {variable.data_type === "BOOL" ? (
            <Select
              size="small"
              value={variable.value || ""}
              onChange={(e) => {
                if (!isEditMode) {
                  data.onVariableChange?.(index, "value", e.target.value);
                }
              }}
              disabled={isEditMode}
              displayEmpty
              renderValue={(selected) => {
                if (!selected || selected === "") {
                  return <Box sx={{ color: "#999999" }}>Select value</Box>;
                }
                return selected;
              }}
              sx={{ flex: 2, borderRadius: "0.25rem" }}
            >
              <MenuItem value="true">true</MenuItem>
              <MenuItem value="false">false</MenuItem>
            </Select>
          ) : (
            <TextField
              size="small"
              placeholder={
                variable.data_type === "OBJECT" || variable.data_type === "LIST"
                  ? "Add JSON"
                  : "Value"
              }
              type="text"
              value={
                (variable.data_type === "OBJECT" ||
                  variable.data_type === "LIST") &&
                variable.value
                  ? variable.data_type === "LIST"
                    ? "[JSON array preview]"
                    : "{JSON object preview}"
                  : variable.value || ""
              }
              onChange={(e) => {
                if (!isEditMode) {
                  const value = e.target.value;
                  // For NUMBER type, validate integer input only
                  if (variable.data_type === "NUMBER") {
                    if (value === "" || /^-?\d*$/.test(value)) {
                      data.onVariableChange?.(index, "value", value);
                    }
                  }
                  // For DECIMAL type, allow float numbers
                  else if (variable.data_type === "DECIMAL") {
                    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                      data.onVariableChange?.(index, "value", value);
                    }
                  } else {
                    data.onVariableChange?.(index, "value", value);
                  }
                }
              }}
              disabled={isEditMode}
              onClick={
                !isEditMode &&
                (variable.data_type === "OBJECT" ||
                  variable.data_type === "LIST")
                  ? () => handleOpenJsonModal(index, variable.value)
                  : undefined
              }
              InputProps={{
                readOnly:
                  variable.data_type === "OBJECT" ||
                  variable.data_type === "LIST",
                endAdornment:
                  (variable.data_type === "OBJECT" ||
                    variable.data_type === "LIST") &&
                  variable.value ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleOpenJsonModal(index, variable.value)
                        }
                        sx={{ padding: "4px" }}
                      >
                        <EditIcon fontSize="small" sx={{ color: "#0060E5" }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                sx: {
                  cursor:
                    variable.data_type === "OBJECT" ||
                    variable.data_type === "LIST"
                      ? "pointer"
                      : "text",
                },
              }}
              sx={{
                flex: 2,
                "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" },
                ...((variable.data_type === "OBJECT" ||
                  variable.data_type === "LIST") && {
                  "& .MuiInputBase-input::placeholder": {
                    color: "#0060E5",
                    opacity: 1,
                  },
                }),
                ...((variable.data_type === "OBJECT" ||
                  variable.data_type === "LIST") &&
                  variable.value && {
                    "& .MuiInputBase-input": {
                      color: "#828592",
                    },
                  }),
              }}
            />
          )}

          {/* Show delete button only if more than one item */}
          {variables.length > 1 && !isEditMode && (
            <IconButton
              size="small"
              sx={{ color: "#828592", width: 40, height: 40, flexShrink: 0 }}
              onClick={() => data.onDeleteVariable?.(index)}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          )}

          {/* Placeholder to maintain alignment */}
          {(variables.length === 1 || isEditMode) && (
            <Box sx={{ width: 40, height: 40, flexShrink: 0 }} />
          )}

          {/* JSON Modal */}
          {jsonModalOpen === index && (
            <AscendModal
              open={jsonModalOpen === index}
              onClose={handleCancelJson}
              config={{
                title: `${variable.data_type === "LIST" ? "JSON Array" : "JSON Object"} for ${data.name || "Variant"} - ${variable.key || "key"}`,
                width: 600,
                maxHeight: "80vh",
                content: (
                  <TextField
                    multiline
                    rows={15}
                    fullWidth
                    value={tempJsonValue}
                    onChange={(e) => handleJsonValueChange(e.target.value)}
                    placeholder="Enter JSON here"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                ),
                actions: (
                  <>
                    <Button
                      onClick={handleCancelJson}
                      variant="text"
                      sx={{ textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSaveJson(index)}
                      variant="contained"
                      disabled={!isValidJson}
                      sx={{ textTransform: "none" }}
                    >
                      Save
                    </Button>
                  </>
                ),
                showCloseButton: false,
              }}
            />
          )}
        </Box>
      ))}

      {/* Add Parameter Button */}
      {!isEditMode && (
        <Button
          startIcon={<AddIcon />}
          onClick={() => data.onAddVariable?.(variables.length - 1)}
          sx={{
            textTransform: "none",
            color: "#333333",
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "0.875rem",
            mt: 1.5,
            justifyContent: "flex-start",
            paddingLeft: 0,
          }}
        >
          Add Parameter
        </Button>
      )}
    </Box>
  );
};

const nodeTypes = {
  targeting: TargetingNode,
  trafficSplit: TrafficSplitNode,
  variant: VariantNode,
};

const generateEdges = (variants: number, isAssignCohortsDirectly: boolean) => {
  const edges = [];

  for (let i = 0; i < variants; i++) {
    const variantId = i === 0 ? "control" : `variant-${i}`;

    if (isAssignCohortsDirectly) {
      edges.push({
        id: `e-targeting-${variantId}`,
        source: "targeting",
        target: variantId,
        style: { stroke: "#DADADD", strokeWidth: 2 },
      });
    } else {
      const splitId = `split-${i + 1}`;

      // Targeting to split (curved)
      edges.push({
        id: `e-targeting-${splitId}`,
        source: "targeting",
        target: splitId,
        style: { stroke: "#DADADD", strokeWidth: 2 },
      });

      // Split to variant (straight line)
      edges.push({
        id: `e-${splitId}-${variantId}`,
        source: splitId,
        target: variantId,
        type: "straight",
        style: { stroke: "#DADADD", strokeWidth: 2 },
      });
    }
  }

  return edges;
};

interface VariantsFlowProps {
  control: Control<any>;
  isEditMode?: boolean;
}

export default function VariantsFlow({
  control,
  isEditMode = false,
}: VariantsFlowProps) {
  const [isTrafficEdited, setIsTrafficEdited] = useState(false);

  const shouldRedistribute = useRef(false);
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);

  const { field: isAssignCohortsDirectlyField } = useController({
    control,
    name: "targeting.isAssignCohortsDirectly",
    defaultValue: false,
  });
  const isAssignCohortsDirectly = isAssignCohortsDirectlyField.value;

  const handleParentModalOpen = useCallback(() => {
    setParentModalOpen(true);
  }, []);

  const handleChildModalOpen = () => {
    setChildModalOpen(true);
  };

  const handleParentModalSave = () => {
    setParentModalOpen(false);
  };
  // Use field arrays for proper react-hook-form management
  const {
    fields: variantFields,
    append: appendVariant,
    update: updateVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const variantsConfig = useMemo(() => {
    const config = variantFields.map((v: any) => ({
      name: v.name,
      trafficSplit: v.trafficSplit,
      variables: v.variables,
    }));
    return config;
  }, [variantFields]);

  // Function to redistribute traffic equally among all variants
  const redistributeEqually = useCallback(() => {
    const totalVariants = variantFields.length;
    const equalSplit = Math.floor(100 / totalVariants);
    const remainder = 100 % totalVariants;

    for (let i = 0; i < totalVariants; i++) {
      const currentVariant: any = variantFields[i];
      if (!currentVariant) {
        console.error(`Variant at index ${i} is undefined!`);
        continue;
      }
      // Give remainder to first variant(s)
      const split = i < remainder ? equalSplit + 1 : equalSplit;
      updateVariant(i, { ...currentVariant, trafficSplit: split.toString() });
    }
  }, [variantFields, updateVariant]);

  // Effect to redistribute traffic when a new variant is added (only if not manually edited)
  useEffect(() => {
    if (shouldRedistribute.current) {
      redistributeEqually();
      shouldRedistribute.current = false;
    }
  }, [variantFields.length, redistributeEqually]);

  // Circular compensation adjusting algorithm
  const adjustSplitCircular = useCallback(
    (editedIndex: number) => {
      const splits = variantFields.map((v: any) =>
        parseInt(v.trafficSplit || "0", 10),
      );
      const total = splits.reduce((a, b) => a + b, 0);

      if (total === 100) return;

      let diff = 100 - total; // positive → need to add, negative → need to reduce
      let index = (editedIndex + 1) % splits.length;
      let checks = 0;

      while (diff !== 0 && checks < splits.length - 1) {
        let current = splits[index];
        let newVal = current;

        if (diff > 0) {
          // Need to add
          const canAdd = 100 - current;
          const add = Math.min(canAdd, diff);
          newVal = current + add;
          diff -= add;
        } else {
          // Need to subtract
          const canSub = current;
          const sub = Math.min(canSub, Math.abs(diff));
          newVal = current - sub;
          diff += sub;
        }

        splits[index] = newVal;
        index = (index + 1) % splits.length;
        checks++;
      }

      // Final update after redistribution
      splits.forEach((v, i) => {
        const variant = variantFields[i];
        updateVariant(i, { ...variant, trafficSplit: v.toString() });
      });
    },
    [variantFields, updateVariant],
  );

  const handleTrafficBlur = useCallback(
    (index: number) => {
      adjustSplitCircular(index);
    },
    [adjustSplitCircular],
  );

  // Function to handle traffic split change with circular redistribution
  const handleTrafficSplitChange = useCallback(
    (index: number, value: string) => {
      if (value !== "" && !/^\d+$/.test(value)) return;

      const num = Math.min(100, Math.max(0, parseInt(value || "0")));
      const variant = variantFields[index];
      updateVariant(index, { ...variant, trafficSplit: num.toString() });
      setIsTrafficEdited(true);
    },
    [variantFields, updateVariant],
  );

  // Generate nodes with onChange handlers (memoized for performance)
  const nodes = useMemo(() => {
    const generateNodesWithHandlers = (
      variantsConfig: any[],
      handleTrafficSplitChange: (index: number, value: string) => void,
      isAssignCohortsDirectly: boolean,
    ) => {
      const COLUMN_GAP = 300;
      const MIN_SPACING = 80;
      const START_X = 5;
      const START_Y = 0;
      const ROW_HEIGHT = 48;
      const BASE_HEIGHT = 64;
      const TARGETING_HEIGHT = 100;

      const nodes = [];
      let currentY = START_Y;
      const variantPositions: number[] = [];

      variantsConfig.forEach((config) => {
        const variablesLength = config.variables?.length || 1;
        const cardHeight = BASE_HEIGHT + variablesLength * ROW_HEIGHT;
        variantPositions.push(currentY + cardHeight / 2);
        currentY += cardHeight + MIN_SPACING;
      });

      const firstVariantCenter = variantPositions[0];
      const lastVariantCenter = variantPositions[variantPositions.length - 1];
      const targetingY =
        (firstVariantCenter + lastVariantCenter) / 2 - TARGETING_HEIGHT / 2;

      nodes.push({
        id: "targeting",
        type: "targeting",
        position: { x: START_X, y: targetingY + -(isEditMode ? 50 : -20) },
        data: { label: "Everyone", onClick: handleParentModalOpen, isEditMode },
      });

      currentY = START_Y;

      variantsConfig.forEach((config, i) => {
        const variablesLength = config.variables?.length || 1;
        const cardHeight =
          BASE_HEIGHT +
          variablesLength * ROW_HEIGHT -
          (isEditMode ? ROW_HEIGHT : 0);

        if (!isAssignCohortsDirectly) {
          nodes.push({
            id: `split-${i + 1}`,
            type: "trafficSplit",
            position: {
              x: START_X + COLUMN_GAP,
              y: currentY + cardHeight / 2 - 6,
            },
            data: {
              percentage: config.trafficSplit || "",
              onChange: (value: string) => handleTrafficSplitChange(i, value),
              onBlur: () => handleTrafficBlur(i),
              isEditMode,
            },
          });
        }

        const variantXPosition = START_X + COLUMN_GAP * 2;

        nodes.push({
          id: i === 0 ? "control" : `variant-${i}`,
          type: "variant",
          position: { x: variantXPosition, y: currentY },
          data: {
            name: config.name,
            variables: config.variables || [
              { key: "", data_type: "", value: "" },
            ],
            canDelete: variantFields.length > 2,
            isEditMode,
            onNameChange: (value: string) => {
              const currentVariant: any = variantFields[i];
              updateVariant(i, { ...currentVariant, name: value });
            },
            onDeleteVariant: () => {
              // Only allow delete if more than two variants exist
              if (variantFields.length > 2) {
                if (isTrafficEdited) {
                  // If traffic has been manually edited, just remove the variant
                  removeVariant(i);
                } else {
                  // If not edited, remove variant and set flag to redistribute equally
                  shouldRedistribute.current = true;
                  removeVariant(i);
                }
              }
            },
            onVariableChange: (index: number, field: string, value: string) => {
              if (field === "key" || field === "data_type") {
                // If changing key or data_type, sync across ALL variants
                variantFields.forEach((variant: any, variantIndex: number) => {
                  const newVariables = [...(variant.variables || [])];
                  if (newVariables[index]) {
                    // If changing the data_type, reset the value field for all variants
                    if (field === "data_type") {
                      newVariables[index] = {
                        ...newVariables[index],
                        [field]: value,
                        value: "",
                      };
                    } else {
                      newVariables[index] = {
                        ...newVariables[index],
                        [field]: value,
                      };
                    }
                    updateVariant(variantIndex, {
                      ...variant,
                      variables: newVariables,
                    });
                  }
                });
              } else {
                // If changing value, only update current variant
                const currentVariant: any = variantFields[i];
                const newVariables = [...(currentVariant.variables || [])];
                newVariables[index] = {
                  ...newVariables[index],
                  [field]: value,
                };
                updateVariant(i, {
                  ...currentVariant,
                  variables: newVariables,
                });
              }
            },
            onAddVariable: (afterIndex: number) => {
              // Add parameter to ALL variants at the same position
              variantFields.forEach((variant: any, variantIndex: number) => {
                const newVariables = [...(variant.variables || [])];
                newVariables.splice(afterIndex + 1, 0, {
                  key: "",
                  data_type: "",
                  value: "",
                });
                updateVariant(variantIndex, {
                  ...variant,
                  variables: newVariables,
                });
              });
            },
            onDeleteVariable: (index: number) => {
              // Delete parameter from ALL variants at the same position
              // Only allow delete if more than one variable
              const currentVariant: any = variantFields[i];
              if ((currentVariant.variables || []).length > 1) {
                variantFields.forEach((variant: any, variantIndex: number) => {
                  const newVariables = [...(variant.variables || [])];
                  if (newVariables.length > 1) {
                    newVariables.splice(index, 1);
                    updateVariant(variantIndex, {
                      ...variant,
                      variables: newVariables,
                    });
                  }
                });
              }
            },
          },
        });

        currentY += cardHeight + MIN_SPACING;
      });

      return nodes;
    };

    return generateNodesWithHandlers(
      variantsConfig,
      handleTrafficSplitChange,
      isAssignCohortsDirectly,
    );
  }, [
    variantsConfig,
    variantFields,
    updateVariant,
    removeVariant,
    handleTrafficSplitChange,
    handleTrafficBlur,
    handleParentModalOpen,
    isAssignCohortsDirectly,
  ]);

  const edges = useMemo(
    () => generateEdges(variantsConfig.length, isAssignCohortsDirectly),
    [variantsConfig.length, isAssignCohortsDirectly],
  );

  // Calculate canvas height dynamically
  const canvasHeight = useMemo(() => {
    const ROW_HEIGHT = 48;
    const BASE_HEIGHT = 64;
    const MIN_SPACING = 80;
    return variantsConfig.reduce((sum: number, config: any) => {
      const variablesLength = config.variables?.length || 1;
      return sum + BASE_HEIGHT + variablesLength * ROW_HEIGHT + MIN_SPACING;
    }, 0);
  }, [variantsConfig]);

  const handleChildModalCancel = () => {
    setChildModalOpen(false);
  };

  const handleChildModalExit = () => {
    setChildModalOpen(false);
    setParentModalOpen(false);
  };

  const handleParentModalClose = () => {
    if (isEditMode) {
      setParentModalOpen(false);
    } else {
      handleChildModalOpen();
    }
  };

  return (
    <Box>
      <AscendModal
        config={{
          width: 600,
          closeOnBackdropClick: isEditMode,
          closeOnEscape: isEditMode,
          showCloseButton: false,
          nestedModal: !isEditMode
            ? {
                width: 400,
                showCloseButton: false,
                children: (
                  <CreateExperimentTargetingChildModal
                    handleChildModalCancel={handleChildModalCancel}
                    handleChildModalExit={handleChildModalExit}
                  />
                ),
              }
            : undefined,
          actions: !isEditMode ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                onClick={handleParentModalClose}
                variant="text"
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleParentModalSave}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </Box>
          ) : undefined,
          children: (
            <CreateExperimentTargetingParentModal
              handleParentModalClose={handleParentModalClose}
              control={control}
              isEditMode={isEditMode}
            />
          ),
        }}
        open={parentModalOpen}
        onClose={handleParentModalClose}
        nestedModalOpen={childModalOpen}
        onNestedModalClose={handleChildModalCancel}
      />
      <Box
        sx={{
          height: `${canvasHeight}px`,
          width: "100%",
          overflow: "auto",
          mb: 0,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}
          minZoom={1}
          maxZoom={1}
          proOptions={{ hideAttribution: true }}
        ></ReactFlow>
      </Box>
      {!isEditMode && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              // Calculate variant number: Control Group is index 0, Variant 1 is index 1, etc.
              // So new variant number = current length (since Control is 0, next is Variant {length})
              const newVariantNumber = variantFields.length;

              // Copy key/data_type structure from first variant, but with empty values
              const firstVariant: any = variantFields[0];
              const variablesTemplate = (
                firstVariant?.variables || [
                  { key: "", data_type: "", value: "" },
                ]
              ).map((v: any) => ({
                key: v.key || "",
                data_type: v.data_type || "",
                value: "",
              }));

              const newVariant = {
                name: `Variant ${newVariantNumber}`,
                trafficSplit: "0",
                variables: variablesTemplate,
                cohorts: [],
              };

              if (isTrafficEdited) {
                // If traffic has been edited, add new variant with 0%
                appendVariant(newVariant);
              } else {
                // If not edited, add variant and set flag to redistribute
                shouldRedistribute.current = true;
                appendVariant(newVariant);
              }
            }}
            sx={{
              textTransform: "none",
              color: "#333333",
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Add Variant
          </Button>
        </Box>
      )}
    </Box>
  );
}

function CreateExperimentTargetingParentModal({
  handleParentModalClose,
  control,
  isEditMode = false,
}: {
  handleParentModalClose: () => void;
  control: Control<any>;
  isEditMode?: boolean;
}) {
  // Use react-hook-form for isAssignCohortsDirectly
  const { field: isAssignCohortsDirectlyField } = useController({
    control,
    name: "targeting.isAssignCohortsDirectly",
    defaultValue: false,
  });

  // Use react-hook-form field array for filters
  const {
    fields: filterFields,
    append: appendFilter,
    remove: removeFilter,
    update: updateFilter,
  } = useFieldArray({
    control,
    name: "targeting.filters",
  });

  // Use react-hook-form for cohorts
  const { field: cohortsField } = useController({
    control,
    name: "targeting.cohorts",
    defaultValue: [],
  });

  // Use react-hook-form field array for variants
  const { fields: variantFields } = useFieldArray({
    control,
    name: "variants",
  });

  const filters = filterFields as Array<{
    id: string;
    operand: string;
    operandDataType: string;
    operator: string;
    value: string;
    condition: string;
  }>;
  const cohorts = cohortsField.value;
  const isAssignCohortsDirectly = isAssignCohortsDirectlyField.value;

  // Helper to get data type based on operand
  const getDataTypeForOperand = (operand: string): string => {
    const dataTypeMap: Record<string, string> = {
      user_id: "STRING",
      guest_id: "STRING",
      model: "STRING",
      device: "STRING",
      app_name: "STRING",
      platform: "STRING",
      os_version: "STRING",
      app_version: "SEMVER_STRING",
      build_number: "NUMBER",
      current_location_city: "STRING",
      current_location_state: "STRING",
      current_location_country: "STRING",
    };
    return dataTypeMap[operand] || "STRING";
  };

  const handleAddFilter = () => {
    appendFilter({
      operand: "",
      operandDataType: "",
      operator: "",
      value: "",
      condition: filters.length === 0 ? "IF" : "AND",
    });
  };

  const handleRemoveFilter = (index: number) => {
    removeFilter(index);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header with Title and Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Targeting
        </Typography>
        <IconButton
          size="small"
          onClick={handleParentModalClose}
          sx={{ ml: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Filters Section */}
      <Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Filters
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          Users are filtered out irrespective of cohorts
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filters.map((filter, index) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
              key={filter.id}
            >
              <Typography variant="body2" sx={{ minWidth: 40 }}>
                {filter.condition}
              </Typography>
              <Controller
                name={`targeting.filters.${index}.operand`}
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    size="small"
                    sx={{ minWidth: 150 }}
                    disabled={isEditMode}
                    {...field}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected: unknown) => {
                        if (!selected || selected === "") {
                          return (
                            <Box sx={{ color: "#999999" }}>Select field</Box>
                          );
                        }
                        const displayNames: Record<string, string> = {
                          user_id: "User ID",
                          guest_id: "Guest ID",
                          model: "Model",
                          device: "Device",
                          app_name: "App Name",
                          platform: "Platform",
                          os_version: "OS Version",
                          app_version: "App Version",
                          build_number: "Build Number",
                          current_location_city: "Current Location City",
                          current_location_state: "Current Location State",
                          current_location_country: "Current Location Country",
                        };
                        return (
                          displayNames[selected as string] ||
                          (selected as string)
                        );
                      },
                    }}
                    onChange={(e) => {
                      if (!isEditMode) {
                        field.onChange(e);
                        // Auto-update operandDataType, clear value and operator when operand changes
                        const currentFilter = filters[index];
                        const newDataType = getDataTypeForOperand(
                          e.target.value,
                        );
                        updateFilter(index, {
                          ...currentFilter,
                          operand: e.target.value,
                          operandDataType: newDataType,
                          operator: "", // Reset operator
                          value: "", // Clear value since data type changed
                        });
                      }
                    }}
                  >
                    <MenuItem value="user_id">User ID</MenuItem>
                    <MenuItem value="guest_id">Guest ID</MenuItem>
                    <MenuItem value="model">Model</MenuItem>
                    <MenuItem value="device">Device</MenuItem>
                    <MenuItem value="app_name">App Name</MenuItem>
                    <MenuItem value="platform">Platform</MenuItem>
                    <MenuItem value="os_version">OS Version</MenuItem>
                    <MenuItem value="app_version">App Version</MenuItem>
                    <MenuItem value="build_number">Build Number</MenuItem>
                    <MenuItem value="current_location_city">
                      Current Location City
                    </MenuItem>
                    <MenuItem value="current_location_state">
                      Current Location State
                    </MenuItem>
                    <MenuItem value="current_location_country">
                      Current Location Country
                    </MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name={`targeting.filters.${index}.operator`}
                control={control}
                render={({ field }) => {
                  const currentFilter = filters[index];
                  const dataType = currentFilter?.operandDataType;

                  // Different operators based on data type
                  const getOperatorOptions = () => {
                    if (dataType === "BOOL") {
                      return [
                        { value: "=", label: "Is equal to" },
                        { value: "!=", label: "Is not equal to" },
                      ];
                    }

                    if (
                      dataType === "NUMBER" ||
                      dataType === "DECIMAL" ||
                      dataType === "SEMVER_STRING"
                    ) {
                      return [
                        { value: "=", label: "Is equal to" },
                        { value: "!=", label: "Is not equal to" },
                        { value: ">", label: "Greater than" },
                        { value: "<", label: "Less than" },
                        { value: ">=", label: "Greater than or equal to" },
                        { value: "<=", label: "Less than or equal to" },
                      ];
                    }

                    // STRING and default
                    return [
                      { value: "=", label: "Is equal to" },
                      { value: "!=", label: "Is not equal to" },
                      { value: "CONTAINS", label: "Contains" },
                    ];
                  };

                  const options = getOperatorOptions();

                  return (
                    <TextField
                      select
                      size="small"
                      sx={{ minWidth: 150 }}
                      disabled={isEditMode}
                      {...field}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected: unknown) => {
                          if (!selected || selected === "") {
                            return (
                              <Box sx={{ color: "#999999" }}>
                                Select operator
                              </Box>
                            );
                          }
                          const option = options.find(
                            (opt) => opt.value === selected,
                          );
                          return option?.label || (selected as string);
                        },
                      }}
                    >
                      {options.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }}
              />
              <Controller
                name={`targeting.filters.${index}.value`}
                control={control}
                render={({ field }) => {
                  const currentFilter = filters[index];
                  const dataType = currentFilter?.operandDataType;

                  // For BOOLEAN type, use a dropdown
                  if (dataType === "BOOL") {
                    return (
                      <TextField
                        select
                        size="small"
                        sx={{ width: 100 }}
                        disabled={isEditMode}
                        {...field}
                        SelectProps={{
                          displayEmpty: true,
                          renderValue: (selected: unknown) => {
                            if (!selected || selected === "") {
                              return <Box sx={{ color: "#999999" }}>Value</Box>;
                            }
                            return selected as string;
                          },
                        }}
                      >
                        <MenuItem value="true">true</MenuItem>
                        <MenuItem value="false">false</MenuItem>
                      </TextField>
                    );
                  }

                  // For NUMBER type (integer only)
                  if (dataType === "NUMBER") {
                    return (
                      <TextField
                        size="small"
                        type="text"
                        placeholder="Value"
                        sx={{ width: 100 }}
                        disabled={isEditMode}
                        {...field}
                        onChange={(e) => {
                          if (!isEditMode) {
                            const value = e.target.value;
                            // Allow empty string and integers only
                            if (value === "" || /^-?\d*$/.test(value)) {
                              field.onChange(value);
                            }
                          }
                        }}
                      />
                    );
                  }

                  // For DECIMAL type (float numbers)
                  if (dataType === "DECIMAL") {
                    return (
                      <TextField
                        size="small"
                        type="text"
                        placeholder="Value"
                        sx={{ width: 100 }}
                        disabled={isEditMode}
                        {...field}
                        onChange={(e) => {
                          if (!isEditMode) {
                            const value = e.target.value;
                            // Allow empty string, numbers, and decimal point
                            if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                              field.onChange(value);
                            }
                          }
                        }}
                      />
                    );
                  }

                  // Default to string input (includes STRING and SEMVER_STRING)
                  return (
                    <TextField
                      size="small"
                      placeholder="Value"
                      sx={{ width: 100 }}
                      disabled={isEditMode}
                      {...field}
                    />
                  );
                }}
              />
              {index > 0 && !isEditMode && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFilter(index)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}

              {index === filters.length - 1 && !isEditMode && (
                <IconButton
                  onClick={handleAddFilter}
                  size="small"
                  color="primary"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Cohorts
        </Typography>
        {!isAssignCohortsDirectly ? (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <AscendDropdown
              placeholder="Select Cohorts"
              variant="multi-chip"
              options={[]}
              value={cohorts}
              fullWidth
              size="lg"
              disabled={isEditMode}
              onChange={(value) => {
                if (!isEditMode) {
                  cohortsField.onChange(value);
                }
              }}
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            {variantFields.map((variant: any, index: number) => (
              <Box
                key={variant.id}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#333333",
                    minWidth: "120px",
                    flexShrink: 0,
                  }}
                >
                  {variant.name}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name={`variants.${index}.cohorts`}
                    control={control}
                    render={({ field }) => (
                      <AscendDropdown
                        placeholder="Select Cohorts"
                        variant="multi-chip"
                        options={[]}
                        value={field.value || []}
                        fullWidth
                        size="lg"
                        disabled={isEditMode}
                        onChange={(value) => {
                          if (!isEditMode) {
                            field.onChange(value);
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
        <Box
          sx={{
            backgroundColor: "#EBF5FF",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <FormControlLabel
            control={<Checkbox disabled={isEditMode} />}
            label="Assign cohorts directly to variants"
            checked={isAssignCohortsDirectly}
            onChange={(e) => {
              if (!isEditMode) {
                isAssignCohortsDirectlyField.onChange(
                  (e.target as HTMLInputElement).checked,
                );
              }
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Assigning cohorts will make it <strong>inaccurate and risky</strong>
            . Make sure to verify each cohort.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function CreateExperimentTargetingChildModal({
  handleChildModalCancel,
  handleChildModalExit,
}: {
  handleChildModalCancel: () => void;
  handleChildModalExit: () => void;
}) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Close without saving?
        </Typography>
        <IconButton
          size="small"
          onClick={handleChildModalCancel}
          sx={{ ml: "auto" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Discarding this will remove all information saved
      </Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={handleChildModalCancel} variant="text" color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleChildModalExit}
          variant="contained"
          color="primary"
        >
          Exit
        </Button>
      </Box>
    </Box>
  );
}

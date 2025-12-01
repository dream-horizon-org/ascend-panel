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
import { Remove as RemoveIcon } from "@mui/icons-material";
import { Control, useFieldArray, useController } from "react-hook-form";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import AscendModal from "../../../components/AscendModal/AscendModal";
import CloseIcon from "@mui/icons-material/Close";
import AscendDropdown from "../../../components/AscendDropdown/AscendDropdown";

// Custom node for Targeting
const TargetingNode = ({ data }: any) => {
  return (
    <Box
      sx={{
        border: "1px solid #DADADD",
        borderRadius: "0.5rem",
        padding: "1rem",
        backgroundColor: "white",
        minWidth: "180px",
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
        <EditIcon
          sx={{ fontSize: "0.875rem", color: "#666666", cursor: "pointer" }}
        />
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
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

      <TextField
        size="small"
        type="text"
        value={data.percentage || ""}
        onChange={(e) => data.onChange?.(e.target.value)}
        onBlur={() => data.onBlur?.()}
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
  const keyValues = data.keyValues || [{ key: "", type: "", value: "" }];
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
      data.onKeyValueChange?.(index, "value", tempJsonValue);
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
          onChange={(e) => data.onNameChange?.(e.target.value)}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" },
          }}
        />
        {data.canDelete ? (
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

      {/* Multiple Key-Value Rows */}
      {keyValues.map((kv: any, index: number) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            mb: index < keyValues.length - 1 ? 1 : 0,
          }}
        >
          <TextField
            size="small"
            placeholder="Key"
            value={kv.key || ""}
            onChange={(e) =>
              data.onKeyValueChange?.(index, "key", e.target.value)
            }
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" },
            }}
          />
          <Select
            size="small"
            value={kv.type || ""}
            onChange={(e) =>
              data.onKeyValueChange?.(index, "type", e.target.value)
            }
            displayEmpty
            renderValue={(selected) => {
              if (!selected || selected === "") {
                return <Box sx={{ color: "#999999" }}>Type</Box>;
              }
              return selected.charAt(0).toUpperCase() + selected.slice(1);
            }}
            sx={{ width: "120px", borderRadius: "0.25rem" }}
          >
            <MenuItem value="string">String</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
            <MenuItem value="json">Json</MenuItem>
          </Select>
          <TextField
            size="small"
            placeholder={kv.type === "json" ? "Add JSON" : "Value"}
            value={
              kv.type === "json" && kv.value
                ? "{JSON code preview}"
                : kv.value || ""
            }
            onChange={(e) =>
              data.onKeyValueChange?.(index, "value", e.target.value)
            }
            onClick={
              kv.type === "json"
                ? () => handleOpenJsonModal(index, kv.value)
                : undefined
            }
            InputProps={{
              readOnly: kv.type === "json",
              endAdornment:
                kv.type === "json" && kv.value ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenJsonModal(index, kv.value)}
                      sx={{ padding: "4px" }}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#0060E5" }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              sx: {
                cursor: kv.type === "json" ? "pointer" : "text",
              },
            }}
            sx={{
              flex: 2,
              "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" },
              ...(kv.type === "json" && {
                "& .MuiInputBase-input::placeholder": {
                  color: "#0060E5",
                  opacity: 1,
                },
              }),
              ...(kv.type === "json" &&
                kv.value && {
                  "& .MuiInputBase-input": {
                    color: "#828592",
                  },
                }),
            }}
          />

          {/* Show delete button only if more than one item */}
          {keyValues.length > 1 && (
            <IconButton
              size="small"
              sx={{ color: "#828592", width: 40, height: 40, flexShrink: 0 }}
              onClick={() => data.onDeleteKeyValue?.(index)}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          )}

          {/* Placeholder to maintain alignment */}
          {keyValues.length === 1 && (
            <Box sx={{ width: 40, height: 40, flexShrink: 0 }} />
          )}

          {/* JSON Modal */}
          {jsonModalOpen === index && (
            <AscendModal
              open={jsonModalOpen === index}
              onClose={handleCancelJson}
              config={{
                title: `JSON for ${data.name || "Variant"} for ${kv.key || "key"}`,
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
      <Button
        startIcon={<AddIcon />}
        onClick={() => data.onAddKeyValue?.(keyValues.length - 1)}
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
    </Box>
  );
};

const nodeTypes = {
  targeting: TargetingNode,
  trafficSplit: TrafficSplitNode,
  variant: VariantNode,
};

// Auto-generate edges based on number of variants
const generateEdges = (variants: number) => {
  const edges = [];

  for (let i = 0; i < variants; i++) {
    const splitId = `split-${i + 1}`;
    const variantId = i === 0 ? "control" : `variant-${i}`;

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

  return edges;
};

interface VariantsFlowProps {
  control: Control<any>;
}

export default function VariantsFlow({ control }: VariantsFlowProps) {
  // Track if traffic splits have been manually edited
  const [isTrafficEdited, setIsTrafficEdited] = useState(false);
  // Track if we need to redistribute traffic after adding a variant
  const shouldRedistribute = useRef(false);
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);

  const handleParentModalOpen = () => {
    setParentModalOpen(true);
  };

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
      keyValues: v.keyValues,
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
  const handleTrafficSplitChange = (index: number, value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    const num = Math.min(100, Math.max(0, parseInt(value || "0")));
    const variant = variantFields[index];
    updateVariant(index, { ...variant, trafficSplit: num.toString() });
    setIsTrafficEdited(true);
  };

  // Generate nodes with onChange handlers (memoized for performance)
  const nodes = useMemo(() => {
    const generateNodesWithHandlers = (
      variantsConfig: any[],
      handleTrafficSplitChange: (index: number, value: string) => void,
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
        const keyValuesLength = config.keyValues?.length || 1;
        const cardHeight = BASE_HEIGHT + keyValuesLength * ROW_HEIGHT;
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
        position: { x: START_X, y: targetingY + 20 },
        data: { label: "Everyone", onClick: handleParentModalOpen },
      });

      currentY = START_Y;

      variantsConfig.forEach((config, i) => {
        const keyValuesLength = config.keyValues?.length || 1;
        const cardHeight = BASE_HEIGHT + keyValuesLength * ROW_HEIGHT;

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
          },
        });

        nodes.push({
          id: i === 0 ? "control" : `variant-${i}`,
          type: "variant",
          position: { x: START_X + COLUMN_GAP * 2, y: currentY },
          data: {
            name: config.name,
            keyValues: config.keyValues || [{ key: "", type: "", value: "" }],
            canDelete: variantFields.length > 2,
            onNameChange: (value: string) => {
              const currentVariant: any = variantFields[i];
              updateVariant(i, { ...currentVariant, name: value });
            },
            onDeleteVariant: () => {
              // Only allow delete if more than two variants exist
              if (variantFields.length > 2) {
                removeVariant(i);
                setIsTrafficEdited(true); // Mark as edited since we're changing the distribution
              }
            },
            onKeyValueChange: (index: number, field: string, value: string) => {
              if (field === "key" || field === "type") {
                // If changing key or type, sync across ALL variants
                variantFields.forEach((variant: any, variantIndex: number) => {
                  const newKeyValues = [...(variant.keyValues || [])];
                  if (newKeyValues[index]) {
                    // If changing the type, reset the value field for all variants
                    if (field === "type") {
                      newKeyValues[index] = {
                        ...newKeyValues[index],
                        [field]: value,
                        value: "",
                      };
                    } else {
                      newKeyValues[index] = {
                        ...newKeyValues[index],
                        [field]: value,
                      };
                    }
                    updateVariant(variantIndex, {
                      ...variant,
                      keyValues: newKeyValues,
                    });
                  }
                });
              } else {
                // If changing value, only update current variant
                const currentVariant: any = variantFields[i];
                const newKeyValues = [...(currentVariant.keyValues || [])];
                newKeyValues[index] = {
                  ...newKeyValues[index],
                  [field]: value,
                };
                updateVariant(i, {
                  ...currentVariant,
                  keyValues: newKeyValues,
                });
              }
            },
            onAddKeyValue: (afterIndex: number) => {
              // Add parameter to ALL variants at the same position
              variantFields.forEach((variant: any, variantIndex: number) => {
                const newKeyValues = [...(variant.keyValues || [])];
                newKeyValues.splice(afterIndex + 1, 0, {
                  key: "",
                  type: "",
                  value: "",
                });
                updateVariant(variantIndex, {
                  ...variant,
                  keyValues: newKeyValues,
                });
              });
            },
            onDeleteKeyValue: (index: number) => {
              // Delete parameter from ALL variants at the same position
              // Only allow delete if more than one key-value pair
              const currentVariant: any = variantFields[i];
              if ((currentVariant.keyValues || []).length > 1) {
                variantFields.forEach((variant: any, variantIndex: number) => {
                  const newKeyValues = [...(variant.keyValues || [])];
                  if (newKeyValues.length > 1) {
                    newKeyValues.splice(index, 1);
                    updateVariant(variantIndex, {
                      ...variant,
                      keyValues: newKeyValues,
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

    return generateNodesWithHandlers(variantsConfig, handleTrafficSplitChange);
  }, [
    variantsConfig,
    variantFields,
    updateVariant,
    removeVariant,
    handleTrafficSplitChange,
    handleTrafficBlur,
    isTrafficEdited,
  ]);

  const edges = useMemo(
    () => generateEdges(variantsConfig.length),
    [variantsConfig.length],
  );

  // Calculate canvas height dynamically
  const canvasHeight = useMemo(() => {
    const ROW_HEIGHT = 48;
    const BASE_HEIGHT = 64;
    const MIN_SPACING = 50;
    return (
      200 +
      variantsConfig.reduce((sum: number, config: any) => {
        const keyValuesLength = config.keyValues?.length || 1;
        return sum + BASE_HEIGHT + keyValuesLength * ROW_HEIGHT + MIN_SPACING;
      }, 0)
    );
  }, [variantsConfig]);

  const handleChildModalCancel = () => {
    setChildModalOpen(false);
  };

  const handleChildModalExit = () => {
    setChildModalOpen(false);
    setParentModalOpen(false);
  };

  const handleParentModalClose = () => {
    handleChildModalOpen();
  };

  return (
    <Box>
      <AscendModal
        config={{
          width: 600,
          closeOnBackdropClick: false,
          closeOnEscape: false,
          showCloseButton: false,
          nestedModal: {
            width: 400,
            showCloseButton: false,
            children: (
              <CreateExperimentTargetingChildModal
                handleChildModalCancel={handleChildModalCancel}
                handleChildModalExit={handleChildModalExit}
              />
            ),
          },
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
          ),
          children: (
            <CreateExperimentTargetingParentModal
              handleParentModalClose={handleParentModalClose}
              control={control}
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
        ></ReactFlow>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            // Calculate variant number: Control Group is index 0, Variant 1 is index 1, etc.
            // So new variant number = current length (since Control is 0, next is Variant {length})
            const newVariantNumber = variantFields.length;

            // Copy key/type structure from first variant, but with empty values
            const firstVariant: any = variantFields[0];
            const keyValuesTemplate = (
              firstVariant?.keyValues || [{ key: "", type: "", value: "" }]
            ).map((kv: any) => ({
              key: kv.key || "",
              type: kv.type || "",
              value: "",
            }));

            const newVariant = {
              name: `Variant ${newVariantNumber}`,
              trafficSplit: "0",
              keyValues: keyValuesTemplate,
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
    </Box>
  );
}

function CreateExperimentTargetingParentModal({
  handleParentModalClose,
  control,
}: {
  handleParentModalClose: () => void;
  control: Control<any>;
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
    defaultValue: ["Tag1"],
  });

  const filters = filterFields as Array<{
    id: string;
    field: string;
    operator: string;
    value: string;
    condition: string;
  }>;
  const cohorts = cohortsField.value;
  const isAssignCohortsDirectly = isAssignCohortsDirectlyField.value;

  const handleAddFilter = () => {
    appendFilter({
      field: "App Version",
      operator: "Is not equal to",
      value: "12.3",
      condition: "AND",
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
              <TextField
                select
                size="small"
                sx={{ minWidth: 150 }}
                value={filter.field}
                onChange={(e) => {
                  updateFilter(index, {
                    ...filter,
                    field: e.target.value,
                  });
                }}
              >
                <MenuItem value="Country">Country</MenuItem>
                <MenuItem value="App Version">App Version</MenuItem>
                <MenuItem value="Device">Device</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                sx={{ minWidth: 150 }}
                value={filter.operator}
                onChange={(e) => {
                  updateFilter(index, {
                    ...filter,
                    operator: e.target.value,
                  });
                }}
              >
                <MenuItem value="Is equal to">Is equal to</MenuItem>
                <MenuItem value="Is not equal to">Is not equal to</MenuItem>
                <MenuItem value="Contains">Contains</MenuItem>
              </TextField>
              <TextField
                size="small"
                sx={{ width: 100 }}
                value={filter.value}
                onChange={(e) => {
                  updateFilter(index, {
                    ...filter,
                    value: e.target.value,
                  });
                }}
              />
              {index > 0 && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFilter(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}

              {index === filters.length - 1 && (
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
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <AscendDropdown
            placeholder="Select Cohorts"
            variant="multi-chip"
            options={["Tag1", "Tag2", "Tag3"]}
            value={cohorts}
            fullWidth
            onChange={(value) => {
              cohortsField.onChange(value);
            }}
          />
        </Box>
        <FormControlLabel
          control={<Checkbox />}
          label="Assign cohorts directly to variants"
          checked={isAssignCohortsDirectly}
          onChange={(e) =>
            isAssignCohortsDirectlyField.onChange(
              (e.target as HTMLInputElement).checked,
            )
          }
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          Assigning cohorts will make it <strong>inaccurate and risky</strong>.
          Make sure to verify each cohort.
        </Typography>
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

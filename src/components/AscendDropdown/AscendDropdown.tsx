import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Chip,
  Checkbox,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type DropdownSize = "sm" | "md" | "lg";
type DropdownVariant = "single" | "multi-checkbox" | "multi-chip";

interface AscendDropdownProps {
  variant?: DropdownVariant;
  size?: DropdownSize;
  label?: string;
  placeholder?: string;
  options: string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  fullWidth?: boolean;
  disabled?: boolean;
  showCount?: boolean;
}

const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: 250,
    },
  },
};

const AscendDropdown: React.FC<AscendDropdownProps> = ({
  variant = "single",
  size = "md",
  label,
  placeholder = "Select...",
  options,
  value: controlledValue,
  onChange,
  fullWidth = false,
  disabled = false,
  showCount = false,
}) => {
  const theme = useTheme();
  const isMultiple = variant !== "single";

  // Auto-apply 999px for multi-checkbox, 4px for others
  const borderRadius = variant === "multi-checkbox" ? "999px" : "4px";
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    isMultiple ? [] : "",
  );

  const value = controlledValue ?? internalValue;

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const newValue = event.target.value;
    const finalValue = isMultiple
      ? typeof newValue === "string"
        ? newValue.split(",")
        : newValue
      : typeof newValue === "string"
        ? newValue
        : newValue[0] || "";

    if (controlledValue === undefined) {
      setInternalValue(finalValue);
    }
    onChange?.(finalValue);
  };

  const getHeight = () => theme.customComponents.dropdown[size];

  const getChipHeight = () => {
    if (size === "lg") return theme.customComponents.dropdown.chipMediumHeight;
    return theme.customComponents.dropdown.chipSmallHeight;
  };

  const handleDeleteChip =
    (chipToDelete: string) => (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!Array.isArray(value)) return;

      const newValue = value.filter((item) => item !== chipToDelete);

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

  const renderValue = (selected: string | string[]) => {
    const isEmpty = isMultiple
      ? !Array.isArray(selected) || selected.length === 0
      : !selected;

    if (isEmpty) {
      if (variant === "multi-checkbox" && showCount) {
        return label || placeholder;
      }
      return <em>{label || placeholder}</em>;
    }

    if (!isMultiple) {
      return selected as string;
    }

    if (variant === "multi-checkbox") {
      if (showCount) {
        const count = (selected as string[]).length;
        return `${label || placeholder} (${count})`;
      }
      return (selected as string[]).join(", ");
    }

    if (variant === "multi-chip") {
      let chipLimit = theme.customComponents.dropdown.chipLimit2;
      if (size == "lg") {
        chipLimit = theme.customComponents.dropdown.chipLimit1;
      }

      const visibleChips = (selected as string[]).slice(0, chipLimit);
      const remainingCount = (selected as string[]).length - chipLimit;

      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {visibleChips.map((item) => (
            <Chip
              key={item}
              label={item}
              size="small"
              onDelete={handleDeleteChip(item)}
              sx={{ height: getChipHeight() }}
            />
          ))}
          {remainingCount > 0 && (
            <Chip
              label={`+${remainingCount}`}
              size="small"
              sx={{
                height: getChipHeight(),
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
              }}
            />
          )}
        </Box>
      );
    }

    return (selected as string[]).join(", ");
  };

  return (
    <FormControl fullWidth={fullWidth} disabled={disabled}>
      <Select
        multiple={isMultiple}
        value={value}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={renderValue}
        IconComponent={KeyboardArrowDownIcon}
        MenuProps={MENU_PROPS}
        displayEmpty
        sx={{
          height: getHeight(),
          borderRadius: borderRadius,
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            paddingTop: 0,
            paddingBottom: 0,
            height: "100%",
            color:
              variant === "multi-checkbox" &&
              showCount &&
              Array.isArray(value) &&
              value.length > 0
                ? theme.palette.primary.main
                : "inherit",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: borderRadius,
            borderWidth: "1px",
            borderColor:
              variant === "multi-checkbox" &&
              showCount &&
              Array.isArray(value) &&
              value.length > 0
                ? theme.palette.primary.main
                : theme.palette.border.main,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor:
              variant === "multi-checkbox" &&
              showCount &&
              Array.isArray(value) &&
              value.length > 0
                ? theme.palette.primary.main
                : theme.palette.primary.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: theme.palette.primary.main,
          },
          "& .MuiSelect-icon": {
            color:
              variant === "multi-checkbox" &&
              showCount &&
              Array.isArray(value) &&
              value.length > 0
                ? theme.palette.primary.main
                : "inherit",
          },
        }}
      >
        {!isMultiple && (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {(variant === "multi-checkbox" || variant === "multi-chip") && (
              <Checkbox
                checked={Array.isArray(value) && value.includes(option)}
              />
            )}
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AscendDropdown;

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
type DropdownBorderRadius = "sm" | "md" | "lg";

interface AscendDropdownProps {
  variant?: DropdownVariant;
  size?: DropdownSize;
  borderRadius?: DropdownBorderRadius;
  label?: string;
  placeholder?: string;
  options: string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  fullWidth?: boolean;
  disabled?: boolean;
  showCount?: boolean;
  iconComponent?: React.ElementType;
}

const getMenuProps = (theme: any) => ({
  PaperProps: {
    style: {
      marginTop: "8px",
      maxHeight: 280,
      borderRadius: "12px",
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12), 0px 0px 2px rgba(0, 0, 0, 0.08)",
      border: `1px solid ${theme.palette.border.main}`,
    },
    sx: {
      "& .MuiList-root": {
        padding: "8px",
      },
    },
  },
  MenuListProps: {
    sx: {
      padding: 0,
    },
  },
  transitionDuration: {
    enter: 250,
    exit: 200,
  },
});

const AscendDropdown: React.FC<AscendDropdownProps> = ({
  variant = "single",
  size = "md",
  borderRadius = "md",
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

  const getBorderRadius = () =>
    theme.customComponents.dropdown.borderRadius[borderRadius];
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
        return (
          <Box component="span" sx={{ fontWeight: 400, color: theme.palette.text.secondary }}>
            {label || placeholder}
          </Box>
        );
      }
      return (
        <Box component="em" sx={{ fontStyle: "normal", color: theme.palette.text.secondary }}>
          {label || placeholder}
        </Box>
      );
    }

    if (!isMultiple) {
      return (
        <Box component="span" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
          {selected as string}
        </Box>
      );
    }

    if (variant === "multi-checkbox") {
      if (showCount) {
        const count = (selected as string[]).length;
        return (
          <Box component="span" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
            {`${label || placeholder} (${count})`}
          </Box>
        );
      }
      return (
        <Box component="span" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
          {(selected as string[]).join(", ")}
        </Box>
      );
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
              sx={{
                height: getChipHeight(),
                borderRadius: "6px",
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                fontWeight: 500,
                fontSize: "12px",
                "& .MuiChip-deleteIcon": {
                  color: theme.palette.primary.main,
                  fontSize: "16px",
                  "&:hover": {
                    color: theme.palette.primary.dark,
                  },
                },
              }}
            />
          ))}
          {remainingCount > 0 && (
            <Chip
              label={`+${remainingCount}`}
              size="small"
              sx={{
                height: getChipHeight(),
                borderRadius: "6px",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.paper,
                fontWeight: 600,
                fontSize: "12px",
              }}
            />
          )}
        </Box>
      );
    }

    return (selected as string[]).join(", ");
  };

  const isSelected =
    variant === "multi-checkbox" &&
    showCount &&
    Array.isArray(value) &&
    value.length > 0;

  return (
    <FormControl fullWidth={fullWidth} disabled={disabled}>
      <Select
        multiple={isMultiple}
        value={value}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={renderValue}
        IconComponent={KeyboardArrowDownIcon}
        MenuProps={getMenuProps(theme)}
        displayEmpty
        sx={{
          height: getHeight(),
          borderRadius: getBorderRadius(),
          backgroundColor: theme.palette.background.paper,
          transition: "all 0.2s ease-in-out",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            height: "100%",
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "12px",
            paddingRight: "32px",
            fontSize: "14px",
            lineHeight: "1.5",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: getBorderRadius(),
            borderWidth: "1.5px",
            borderColor: isSelected
              ? theme.palette.primary.main
              : theme.palette.border.main,
            transition: "all 0.2s ease-in-out",
          },
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: "1.5px",
              borderColor: theme.palette.primary.main,
            },
          },
          "&.Mui-focused": {
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: "1.5px",
              borderColor: theme.palette.primary.main,
            },
          },
          "&.Mui-disabled": {
            backgroundColor: theme.customComponents.ascendTextField.disabled.backgroundColor,
            opacity: 0.6,
          },
          "& .MuiSelect-icon": {
            color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
            transition: "transform 0.2s ease-in-out, color 0.2s ease-in-out",
          },
          "&.Mui-focused .MuiSelect-icon": {
            transform: "rotate(180deg)",
          },
        }}
      >
        {!isMultiple && (
          <MenuItem
            disabled
            value=""
            sx={{
              display: "none",
            }}
          >
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              borderRadius: "8px",
              margin: "2px 0",
              padding: "10px 12px",
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                transform: "translateX(4px)",
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.light,
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                },
              },
              "& .MuiCheckbox-root": {
                padding: "4px 8px 4px 4px",
              },
            }}
          >
            {(variant === "multi-checkbox" || variant === "multi-chip") && (
              <Checkbox
                checked={Array.isArray(value) && value.includes(option)}
                sx={{
                  color: theme.palette.primary.main,
                  "&.Mui-checked": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            )}
            <ListItemText
              primary={option}
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "14px",
                },
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AscendDropdown;

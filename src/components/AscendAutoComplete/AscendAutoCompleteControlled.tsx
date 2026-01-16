import { Control, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import AscendTextField from "../AscendTextField/AscendTextField";

interface AscendAutoCompleteControlledProps {
  name: string;
  control: Control<any>;
  label?: string;
  infoText?: string;
  required?: boolean;
  placeholder?: string;
  options: string[];
  multiple?: boolean;
  freeSolo?: boolean;
  filterSelectedOptions?: boolean;
  className?: string;
  chipStyles?: SxProps<Theme>;
  disabled?: boolean;
}

const AscendAutoCompleteControlled = ({
  name,
  control,
  label,
  infoText,
  required = false,
  placeholder,
  options,
  multiple = false,
  freeSolo = false,
  filterSelectedOptions = false,
  className = "",
  chipStyles,
  disabled = false,
}: AscendAutoCompleteControlledProps) => {
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={`flex flex-col w-full ${className}`}>
          <Autocomplete
            multiple={multiple}
            freeSolo={freeSolo}
            filterSelectedOptions={filterSelectedOptions}
            options={options}
            value={value || (multiple ? [] : null)}
            onChange={(_, newValue) => {
              if (!disabled) {
                onChange(newValue);
              }
            }}
            disabled={disabled}
            size="small"
            fullWidth
            popupIcon={<KeyboardArrowDownIcon />}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    {...tagProps}
                    deleteIcon={<CloseIcon />}
                    sx={{
                      borderRadius: "6px",
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      fontSize: "12px",
                      height: "24px",
                      "& .MuiChip-deleteIcon": {
                        color: theme.palette.primary.main,
                        fontSize: "16px",
                        "&:hover": {
                          color: theme.palette.primary.dark,
                        },
                      },
                      ...chipStyles,
                    }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <AscendTextField
                {...params}
                label={label || ""}
                infoText={infoText}
                required={required}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message}
              />
            )}
            slotProps={{
              paper: {
                sx: {
                  marginTop: "8px",
                  borderRadius: "12px",
                  boxShadow:
                    "0px 8px 24px rgba(0, 0, 0, 0.12), 0px 0px 2px rgba(0, 0, 0, 0.08)",
                  border: `1px solid ${theme.palette.border.main}`,
                  "& .MuiAutocomplete-listbox": {
                    padding: "8px",
                    "& .MuiAutocomplete-option": {
                      borderRadius: "8px",
                      margin: "2px 0",
                      padding: "10px 12px",
                      fontSize: "14px",
                      transition: "all 0.15s ease-in-out",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                        transform: "translateX(4px)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: theme.palette.primary.light,
                      },
                      '&[aria-selected="true"]': {
                        backgroundColor: theme.palette.primary.light,
                        fontWeight: 500,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.light,
                        },
                      },
                    },
                  },
                },
              },
              popper: {
                sx: {
                  "& .MuiAutocomplete-noOptions": {
                    padding: "12px",
                    fontSize: "14px",
                    color: theme.palette.text.secondary,
                  },
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "&.Mui-focused": {
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                  "& .MuiAutocomplete-popupIndicator": {
                    transform: "rotate(180deg)",
                  },
                },
              },
              "& .MuiAutocomplete-popupIndicator": {
                transition: "transform 0.2s ease-in-out",
              },
            }}
          />
        </div>
      )}
    />
  );
};

export default AscendAutoCompleteControlled;

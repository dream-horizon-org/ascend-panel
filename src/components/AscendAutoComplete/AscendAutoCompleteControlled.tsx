import { Control, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SxProps, Theme } from "@mui/material/styles";
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
                    sx={chipStyles}
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
          />
        </div>
      )}
    />
  );
};

export default AscendAutoCompleteControlled;

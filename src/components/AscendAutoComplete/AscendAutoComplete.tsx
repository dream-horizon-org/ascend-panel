import { ReactElement } from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { useTheme } from "@mui/material/styles";
import AscendTextField from "../AscendTextField/AscendTextField";

type AscendAutoCompleteProps<T> = Omit<
  AutocompleteProps<
    T,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >,
  "renderInput"
> & {
  label: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
};

function AscendAutoComplete<T>({
  label,
  infoText,
  required = false,
  className = "",
  placeholder,
  error,
  helperText,
  size = "small",
  fullWidth = true,
  ...props
}: AscendAutoCompleteProps<T>): ReactElement {
  const theme = useTheme();

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <Autocomplete
        size={size}
        fullWidth={fullWidth}
        {...props}
        renderInput={(params) => (
          <AscendTextField
            {...params}
            label={label}
            infoText={infoText}
            required={required}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
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
                padding: "12px 16px",
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
  );
}

export default AscendAutoComplete;

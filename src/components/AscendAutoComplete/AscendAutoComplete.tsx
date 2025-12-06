import { ReactElement } from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
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
      />
    </div>
  );
}

export default AscendAutoComplete;

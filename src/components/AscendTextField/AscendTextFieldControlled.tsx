import { Control, Controller, FieldValues, Path } from "react-hook-form";
import AscendTextField from "./AscendTextField";
import { TextFieldProps } from "@mui/material/TextField";

type AscendTextFieldControlledProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name"
> & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  infoText?: string;
  required?: boolean;
  className?: string;
  width?: string;
  height?: string;
};

function AscendTextFieldControlled<T extends FieldValues>({
  name,
  control,
  label,
  infoText,
  required,
  className,
  width,
  height,
  ...props
}: AscendTextFieldControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AscendTextField
          {...field}
          label={label}
          infoText={infoText}
          required={required}
          className={className}
          width={width}
          height={height}
          error={!!error}
          helperText={error?.message}
          {...props}
        />
      )}
    />
  );
}

export default AscendTextFieldControlled;

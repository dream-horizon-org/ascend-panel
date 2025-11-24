import { FC, ReactNode } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Search as SearchIcon } from "@mui/icons-material";

type AscendSearchbarProps = TextFieldProps & {
  startIcon?: ReactNode | null;
  placeholder?: string;
  className?: string;
  showIcon?: boolean;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
};

const AscendSearchbar: FC<AscendSearchbarProps> = ({
  startIcon,
  placeholder = "Search...",
  className = "",
  showIcon = true,
  size = "small",
  fullWidth = true,
  InputProps,
  ...props
}) => {
  const iconToShow =
    startIcon !== undefined ? startIcon : showIcon ? <SearchIcon /> : null;

  return (
    <TextField
      size={size}
      fullWidth={fullWidth}
      placeholder={placeholder}
      className={className}
      InputProps={{
        ...InputProps,
        startAdornment: iconToShow ? (
          <InputAdornment position="start">{iconToShow}</InputAdornment>
        ) : (
          InputProps?.startAdornment
        ),
      }}
      {...props}
    />
  );
};

export default AscendSearchbar;

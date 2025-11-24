import { FC, ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";

type AscendButtonProps = Omit<ButtonProps, "startIcon" | "endIcon"> & {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

const AscendButton: FC<AscendButtonProps> = ({
  children,
  startIcon,
  endIcon,
  disabled = false,
  className = "",
  variant = "contained",
  color = "primary",
  size = "medium",
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AscendButton;

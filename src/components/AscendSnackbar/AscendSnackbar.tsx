import { FC } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

export interface AscendSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
  onClose: () => void;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

const AscendSnackbar: FC<AscendSnackbarProps> = ({
  open,
  message,
  severity = "info",
  autoHideDuration = 6000,
  onClose,
  anchorOrigin = { vertical: "top", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AscendSnackbar;

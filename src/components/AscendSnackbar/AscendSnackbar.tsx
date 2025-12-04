import { FC } from "react";
import { Snackbar, Alert, AlertColor, Fade } from "@mui/material";

export interface AscendSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number | null;
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
  autoHideDuration = 3000,
  onClose,
  anchorOrigin = { vertical: "top", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AscendSnackbar;

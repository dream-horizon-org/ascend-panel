import { FC, ReactNode } from "react";
import Paper, { PaperProps } from "@mui/material/Paper";

type AscendPaperProps = PaperProps & {
  children: ReactNode;
  className?: string;
};

const AscendPaper: FC<AscendPaperProps> = ({
  children,
  className = "",
  elevation = 1,
  variant = "elevation",
  ...props
}) => {
  return (
    <Paper
      elevation={elevation}
      variant={variant}
      className={className}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default AscendPaper;


import { FC, ReactNode } from "react";
import Menu, { MenuProps } from "@mui/material/Menu";
import { useTheme } from "@mui/material/styles";

type AscendMenuProps = Omit<MenuProps, "PaperProps"> & {
  children: ReactNode;
  className?: string;
};

const AscendMenu: FC<AscendMenuProps> = ({
  children,
  className = "",
  anchorOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "right",
  },
  ...props
}) => {
  const theme = useTheme();

  return (
    <Menu
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={{
        sx: {
          marginTop: "0.5rem",
          minWidth: "200px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "0.5rem",
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </Menu>
  );
};

export default AscendMenu;

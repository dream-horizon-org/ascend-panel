import { FC, ReactNode } from "react";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";

type AscendMenuItemProps = Omit<MenuItemProps, "children"> & {
  children: ReactNode;
  className?: string;
};

const AscendMenuItem: FC<AscendMenuItemProps> = ({
  children,
  className = "",
  onClick,
  sx,
  ...props
}) => {
  const theme = useTheme();

  return (
    <MenuItem
      onClick={onClick}
      className={className}
      sx={{
        fontFamily: "Inter",
        fontSize: "0.875rem",
        color: theme.palette.text.primary,
        padding: "0.75rem 1rem",
        "&:hover": {
          backgroundColor: theme.palette.background.default,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MenuItem>
  );
};

export default AscendMenuItem;


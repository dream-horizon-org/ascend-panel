import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";
import ScienceIcon from "@mui/icons-material/Science";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

const tabRoutes = ["/", "/audience", "/settings"];

export default function SideNavTabs() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (location.pathname.startsWith("/audience")) return 1;
    if (location.pathname === "/settings") return 2;
    return 0;
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(tabRoutes[newValue]);
  };

  return (
    <Box
      sx={{
        width: theme.customComponents.sidebar.width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Tabs
        orientation="vertical"
        value={getActiveTab()}
        onChange={handleChange}
        sx={{
          width: "100%",
          minHeight: "auto",
          "& .MuiTabs-indicator": {
            display: "block",
            left: 0,
            width: theme.customComponents.sidebar.indicatorWidth,
            backgroundColor: theme.palette.primary.main,
            borderRadius: theme.customComponents.sidebar.indicatorBorderRadius,
          },
          "& .MuiTab-root": {
            minWidth: theme.customComponents.sidebar.tabSize,
            width: theme.customComponents.sidebar.tabSize,
            height: theme.customComponents.sidebar.tabSize,
            padding: theme.customComponents.sidebar.tabPadding,
            minHeight: theme.customComponents.sidebar.tabSize,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          },
          "& .Mui-selected": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiTab-root svg": {
            width: theme.customComponents.sidebar.iconSize,
            height: theme.customComponents.sidebar.iconSize,
            fontSize: theme.customComponents.sidebar.iconSize,
            color: theme.palette.neutral.main,
          },
        }}
      >
        <Tab icon={<ScienceIcon />} aria-label="experiments" />
        <Tab icon={<PeopleIcon />} aria-label="audience" />
        <Tab icon={<SettingsIcon />} aria-label="settings" />
      </Tabs>
    </Box>
  );
}

import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ScienceIcon from "@mui/icons-material/Science";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

export default function SideNavTabs() {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "48px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderRight: `1px solid ${theme.customColors.sidebar.border}`,
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        sx={{
          width: "100%",
          minHeight: "auto",
          "& .MuiTabs-indicator": {
            display: "block",
            left: 0,
            width: "4px",
            backgroundColor: theme.customColors.sidebar.indicatorColor,
            borderRadius: "0 4px 4px 0",
          },
          "& .MuiTab-root": {
            minWidth: "48px",
            width: "48px",
            height: "48px",
            padding: "12px",
            minHeight: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          },
          "& .Mui-selected": {
            backgroundColor: theme.customColors.sidebar.selectedBackground,
          },
          "& .MuiTab-root svg": {
            width: "24px",
            height: "24px",
            fontSize: "24px",
            color: theme.customColors.sidebar.iconColor,
          },
        }}
      >
        <Tab icon={<ScienceIcon />} aria-label="experiments" />
        <Tab icon={<PeopleAltOutlinedIcon />} aria-label="users" />
        <Tab icon={<SettingsIcon />} aria-label="settings" />
      </Tabs>
    </Box>
  );
}

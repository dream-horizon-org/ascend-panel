import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppBar from "../AscendAppBar/AscendAppBar.tsx";
import SideNavTabs from "../AscendTabNavigation/AscendTabNavigation.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
        <AppBar />
      </Box>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          marginTop: theme.customSpacing.appBarHeight,
        }}
      >
        <Box
          sx={{
            width: theme.customSpacing.sidebarWidth,
            height: `calc(100vh - ${theme.customSpacing.appBarHeight})`,
            position: "fixed",
            top: theme.customSpacing.appBarHeight,
            left: 0,
            display: "flex",
            justifyContent: "center",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <SideNavTabs />
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft: theme.customSpacing.sidebarWidth,
            overflowY: "auto",
            height: `calc(100vh - ${theme.customSpacing.appBarHeight})`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

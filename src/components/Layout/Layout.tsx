import React from "react";
import { Box } from "@mui/material";
import AppBar from "../AppBar/AppBar.tsx";
import SideNavTabs from "../TabNavigation/TabNavigation.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* --- Top AppBar --- */}
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
      >
            <AppBar />
      </Box>

      {/* --- Sidebar + Content Container --- */}
      <Box sx={{ display: "flex", width: "100%", marginTop: "56px" }}>
        {/* Side Navigation (Fixed) */}
        <Box
          sx={{
            width: "48px",
            height: "calc(100vh - 56px)",
            position: "fixed",
            top: "56px",
            left: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SideNavTabs />
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: "20px",
            marginLeft: "48px",
            overflowY: "auto",
            height: "calc(100vh - 56px)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

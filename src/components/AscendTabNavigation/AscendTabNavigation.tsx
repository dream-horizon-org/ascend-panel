import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";
import ScienceIcon from "@mui/icons-material/Science";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useProject } from "../../context/ProjectContext";
import { tenantManagementApi } from "../../network/tenantManagement/api";

const tabRoutes = ["/", "/settings"];

function getProjectInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getProjectColor(name: string): string {
  const colors = [
    "#4ECDC4", // Teal
    "#FF6B6B", // Red
    "#45B7D1", // Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#85C1E2", // Sky Blue
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function SideNavTabs() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProject, setSelectedProject, setProjects, projects } = useProject();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (location.pathname === "/settings") return 1;
    return 0;
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(tabRoutes[newValue]);
  };

  const handleProjectClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProjectClose = () => {
    setAnchorEl(null);
  };

  const handleProjectSelect = (project: typeof selectedProject) => {
    if (project) {
      setSelectedProject(project);
    }
    handleProjectClose();
  };

  // Load projects and set default
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const resp = await tenantManagementApi.getTenants({ page: 1, limit: 1 });
        if (resp.data.tenants.length > 0) {
          const tenantId = resp.data.tenants[0].tenant_id;
          const projectsResp = await tenantManagementApi.getProjects(tenantId, { page: 1, limit: 50 });
          setProjects(projectsResp.data.projects);
          // Project selection is now handled in ProjectContext based on localStorage
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* Project Selector */}
      <Box
        sx={{
          width: "100%",
          padding: "12px 16px",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {selectedProject ? (
          <Box
            onClick={handleProjectClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: getProjectColor(selectedProject.name),
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: getProjectColor(selectedProject.name),
                }}
              >
                {getProjectInitials(selectedProject.name)}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#FFFFFF",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedProject.name}
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#FFFFFF", flexShrink: 0 }} />
          </Box>
        ) : (
          <Box
            onClick={handleProjectClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: theme.palette.grey[200],
              "&:hover": {
                backgroundColor: theme.palette.grey[300],
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: theme.palette.text.secondary,
              }}
            >
              {projects.length > 0 ? "Select Project" : "No Projects"}
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
          </Box>
        )}

        {/* Projects Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleProjectClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              marginTop: 1,
              minWidth: 240,
              maxHeight: 400,
              overflowY: "auto",
            },
          }}
        >
          {projects.length > 0 ? (
            projects.map((project) => {
              const isSelected = selectedProject?.project_id === project.project_id;
              const initials = getProjectInitials(project.name);
              const color = getProjectColor(project.name);
              return (
                <MenuItem
                  key={project.project_id}
                  onClick={() => handleProjectSelect(project)}
                  selected={isSelected}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    paddingX: 2,
                    paddingY: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "6px",
                      backgroundColor: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                      }}
                    >
                      {initials}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? theme.palette.primary.main : "#333",
                      flex: 1,
                    }}
                  >
                    {project.name}
                  </Typography>
                </MenuItem>
              );
            })
          ) : (
            <MenuItem disabled>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                No projects available
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </Box>

      {/* Navigation Tabs */}
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
            minWidth: "auto",
            width: "100%",
            height: "48px",
            padding: "12px 16px",
            minHeight: "48px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "12px",
            position: "relative",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            color: theme.palette.neutral.main,
          },
          "& .Mui-selected": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            fontWeight: 600,
          },
          "& .MuiTab-root svg": {
            width: theme.customComponents.sidebar.iconSize,
            height: theme.customComponents.sidebar.iconSize,
            fontSize: theme.customComponents.sidebar.iconSize,
            color: "inherit",
          },
        }}
      >
        <Tab icon={<ScienceIcon />} label="Experiments" aria-label="experiments" />
        <Tab icon={<SettingsIcon />} label="Settings" aria-label="settings" />
      </Tabs>
    </Box>
  );
}

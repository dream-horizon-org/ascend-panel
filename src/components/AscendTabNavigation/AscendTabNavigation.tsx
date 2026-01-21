import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";
import ScienceIcon from "@mui/icons-material/Science";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { useProject } from "../../context/ProjectContext";
import { tenantManagementApi } from "../../network/tenantManagement/api";

const tabRoutes = ["/", "/audience", "/settings"];

function getProjectInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
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
    if (location.pathname.startsWith("/audience")) return 1;
    if (location.pathname === "/settings") return 2;
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
      handleProjectClose();
      // Navigate to homepage with full page refresh
      window.location.href = "/";
    } else {
      handleProjectClose();
    }
  };

  // Load projects and set default
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const resp = await tenantManagementApi.getTenants({
          page: 1,
          limit: 1,
        });
        if (resp.data.tenants.length > 0) {
          const tenantId = resp.data.tenants[0].tenant_id;
          const projectsResp = await tenantManagementApi.getProjects(tenantId, {
            page: 1,
            limit: 50,
          });
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
          padding: "8px",
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {selectedProject ? (
          <Box
            onClick={handleProjectClick}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              width: "48px",
              height: "48px",
              borderRadius: "6px",
              backgroundColor: "#0060e5",
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
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0060e5",
                }}
              >
                {getProjectInitials(selectedProject.name)}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            onClick={handleProjectClick}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              width: "48px",
              height: "48px",
              borderRadius: "6px",
              backgroundColor: theme.palette.grey[200],
              "&:hover": {
                backgroundColor: theme.palette.grey[300],
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: theme.palette.text.secondary,
              }}
            >
              ?
            </Typography>
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
              const isSelected =
                selectedProject?.project_id === project.project_id;
              const initials = getProjectInitials(project.name);
              const color = "#0060e5";
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
                  
                  <Typography
                    sx={{
                      fontSize: "14px",
                      marginLeft: "10px",
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
            padding: 0,
            minHeight: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 0,
            position: "relative",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            color: theme.palette.neutral.main,
          },
          "& .MuiTab-root .MuiTab-iconWrapper": {
            margin: 0,
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
        <Tab icon={<ScienceIcon />} aria-label="experiments" />
        <Tab icon={<PeopleIcon />} aria-label="audience" />
        <Tab icon={<SettingsIcon />} aria-label="settings" />
      </Tabs>
    </Box>
  );
}

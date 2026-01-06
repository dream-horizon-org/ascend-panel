import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AscendButton from "../../components/AscendButton/AscendButton";
import AscendModal from "../../components/AscendModal/AscendModal";
import AscendTextField from "../../components/AscendTextField/AscendTextField";
import AscendSnackbar from "../../components/AscendSnackbar/AscendSnackbar";
import {
  TenantDetails,
  ProjectSummary,
} from "../../network/tenantManagement/mockApi";
import {
  tenantManagementApi,
  TenantApiError,
} from "../../network/tenantManagement/api";
import { useProject } from "../../context/ProjectContext";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
};

function copyToClipboard(value: string) {
  return navigator.clipboard.writeText(value);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function TenantManagementSection() {
  const theme = useTheme();
  const { setProjects: setContextProjects, selectedProject } = useProject();
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  // Single-tenant model
  const [tenantLoading, setTenantLoading] = useState(false);
  const [tenantCreating, setTenantCreating] = useState(false);
  const [tenant, setTenant] = useState<TenantDetails | null>(null);
  const [tenantName, setTenantName] = useState("Acme Corp");
  const [tenantDescription, setTenantDescription] = useState(
    "Primary account for Acme"
  );
  const [tenantEmail, setTenantEmail] = useState("admin@acme.com");

  // Projects
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectCreating, setProjectCreating] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  // Per-project API key (single)
  const [projectKeys, setProjectKeys] = useState<
    Record<
      string,
      | {
          key_id: string;
          name: string;
          api_key_masked: string;
          api_key: string;
          created_at: string;
          last_rotated_at: string | null;
          status: string;
        }
      | null
      | undefined
    >
  >({});
  const [rowBusy, setRowBusy] = useState<Record<string, boolean>>({});

  // Show-once raw secret modal
  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [secretModalTitle, setSecretModalTitle] = useState("API Key");
  const [rawApiKey, setRawApiKey] = useState("");
  const [rawKeyId, setRawKeyId] = useState("");

  const tenantId = tenant?.tenant_id || "";

  const showError = (err: unknown, fallback: string) => {
    if (err instanceof TenantApiError) {
      setSnackbar({
        open: true,
        message: `${err.status} — ${err.message}`,
        severity: "error",
      });
      return;
    }
    setSnackbar({ open: true, message: fallback, severity: "error" });
  };

  const refreshTenant = async () => {
    try {
      setTenantLoading(true);
      const resp = await tenantManagementApi.getTenants({ page: 1, limit: 1 });
      const first = resp.data.tenants[0];
      if (!first) {
        setTenant(null);
        return;
      }
      const details = await tenantManagementApi.getTenantDetails(
        first.tenant_id
      );
      setTenant(details.data);
    } catch (e) {
      showError(e, "Failed to fetch tenant");
    } finally {
      setTenantLoading(false);
    }
  };

  const refreshProjects = async (tId: string) => {
    try {
      setProjectsLoading(true);
      const resp = await tenantManagementApi.getProjects(tId, {
        page: 1,
        limit: 50,
      });
      setProjects(resp.data.projects);
      setContextProjects(resp.data.projects);

      // Extract API key information directly from project objects
      // According to OpenAPI spec, ListProjectsResponse includes API key info in each project
      const keysMap: Record<
        string,
        | {
            key_id: string;
            name: string;
            api_key_masked: string;
            api_key: string;
            created_at: string;
            last_rotated_at: string | null;
            status: string;
          }
        | null
        | undefined
      > = {};
      resp.data.projects.forEach((p) => {
        // Check if project has API key information
        if (p.api_key_id && p.api_key) {
          // Create a masked version of the API key for display
          // Format: first 10 chars + ... + last 4 chars
          const apiKey = p.api_key;
          const maskedKey =
            apiKey.length > 14
              ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`
              : `${apiKey.slice(0, 6)}...${apiKey.slice(-2)}`;

          keysMap[p.project_id] = {
            key_id: p.api_key_id,
            name: p.api_key_name || p.name,
            api_key_masked: maskedKey,
            api_key: apiKey,
            created_at: p.api_key_created_at || p.created_at,
            last_rotated_at: p.last_rotated_at || null,
            status: p.api_key_status || "ACTIVE",
          };
        } else {
          keysMap[p.project_id] = null;
        }
      });
      setProjectKeys(keysMap);
    } catch (e) {
      showError(e, "Failed to fetch projects");
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const refreshProjectKey = async (tId: string, projectId: string) => {
    try {
      // Refresh the project list to get updated API key info
      // The API includes API key info in the project response
      const projectsResp = await tenantManagementApi.getProjects(tId, {
        page: 1,
        limit: 50,
      });
      const projectWithKey = projectsResp.data.projects.find(
        (p) => p.project_id === projectId
      );

      if (projectWithKey?.api_key_id && projectWithKey?.api_key) {
        const apiKey = projectWithKey.api_key;
        const maskedKey =
          apiKey.length > 14
            ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`
            : `${apiKey.slice(0, 6)}...${apiKey.slice(-2)}`;

        setProjectKeys((prev) => ({
          ...prev,
          [projectId]: {
            key_id: projectWithKey.api_key_id!,
            name: projectWithKey.api_key_name || projectWithKey.name,
            api_key_masked: maskedKey,
            api_key: apiKey,
            created_at:
              projectWithKey.api_key_created_at || projectWithKey.created_at,
            last_rotated_at: projectWithKey.last_rotated_at || null,
            status: projectWithKey.api_key_status || "ACTIVE",
          },
        }));
      } else {
        setProjectKeys((prev) => ({ ...prev, [projectId]: null }));
      }
    } catch (e) {
      showError(e, "Failed to fetch API keys");
      setProjectKeys((prev) => ({ ...prev, [projectId]: null }));
    }
  };

  useEffect(() => {
    refreshTenant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!tenantId) {
      setProjects([]);
      setProjectKeys({});
      return;
    }
    refreshProjects(tenantId);
    setProjectKeys({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  // Load API key for selected project when it changes
  useEffect(() => {
    if (selectedProject && tenantId) {
      refreshProjectKey(tenantId, selectedProject.project_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject?.project_id, tenantId]);

  const onCreateTenant = async () => {
    try {
      setTenantCreating(true);
      const resp = await tenantManagementApi.createTenant({
        name: tenantName,
        description: tenantDescription || undefined,
        contact_email: tenantEmail,
      });
      setSnackbar({
        open: true,
        message: `Tenant created: ${resp.data.name}`,
        severity: "success",
      });
      await refreshTenant();
    } catch (e) {
      showError(e, "Failed to create tenant");
    } finally {
      setTenantCreating(false);
    }
  };

  const onCreateProject = async () => {
    if (!tenantId) return;
    try {
      setProjectCreating(true);
      const resp = await tenantManagementApi.createProject(tenantId, {
        name: projectName,
      });

      // The createProject response already includes API key details
      // No need to make a separate API call to generate the key
      const projectData = resp.data;

      if (projectData.api_key && projectData.api_key_id) {
        // Show the raw key in modal since it's auto-generated
        setRawApiKey(projectData.api_key);
        setRawKeyId(projectData.api_key_id);
        setSecretModalTitle("API Key generated (shown once)");
        setSecretModalOpen(true);

        // Store the masked key
        const maskedKey =
          projectData.api_key.length > 14
            ? `${projectData.api_key.slice(0, 10)}...${projectData.api_key.slice(-4)}`
            : `${projectData.api_key.slice(0, 6)}...${projectData.api_key.slice(-2)}`;

        setProjectKeys((prev) => ({
          ...prev,
          [projectData.project_id]: {
            key_id: projectData.api_key_id!,
            name: projectData.api_key_name || projectName,
            api_key_masked: maskedKey,
            api_key: projectData.api_key,
            created_at: new Date().toISOString(), // Use current time since API doesn't return created_at for key
            last_rotated_at: null,
            status: projectData.status || "ACTIVE",
          },
        }));
      }

      setSnackbar({
        open: true,
        message: `Project created: ${resp.data.project_key}`,
        severity: "success",
      });
      setProjectName("");
      setCreateProjectOpen(false);
      await refreshProjects(tenantId);
    } catch (e) {
      showError(e, "Failed to create project");
    } finally {
      setProjectCreating(false);
    }
  };

  const onRotateProjectKey = async (projectId: string, keyId: string) => {
    if (!tenantId || !projectId || !keyId) return;
    try {
      setRowBusy((p) => ({ ...p, [projectId]: true }));
      const resp = await tenantManagementApi.rotateApiKey(
        tenantId,
        projectId,
        keyId.trim()
      );
      setRawApiKey(resp.data.api_key);
      setRawKeyId(resp.data.key_id);
      setSecretModalTitle("API Key rotated (shown once)");
      setSecretModalOpen(true);
      // Store the masked key
      const maskedKey = `${resp.data.api_key.slice(0, 10)}...${resp.data.api_key.slice(-4)}`;
      setProjectKeys((prev) => ({
        ...prev,
        [projectId]: {
          key_id: resp.data.key_id,
          name: resp.data.name,
          api_key_masked: maskedKey,
          api_key: resp.data.api_key,
          created_at: resp.data.rotated_at,
          last_rotated_at: resp.data.rotated_at,
          status: "ACTIVE",
        },
      }));
      await refreshProjects(tenantId);
    } catch (e) {
      showError(e, "Failed to rotate API key");
    } finally {
      setRowBusy((p) => ({ ...p, [projectId]: false }));
    }
  };

  const tenantCreateDisabled =
    tenantCreating ||
    tenantName.trim().length < 3 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantEmail.trim());

  const projectCreateDisabled =
    projectCreating || !tenantId || !projectName.trim();

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        border: "1px solid #E0E0E0",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
        width: "100%",
        marginTop: "24px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#F8F9FC",
          padding: "16px 24px",
          borderBottom: "1px solid #E0E0E0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            color: "#33343E",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Tenant Management
        </Typography>
      </Box>

      <Box
        sx={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Tenant */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography
            sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
          >
            Tenant
          </Typography>
          {tenant ? (
            <Box
              sx={{
                border: "1px solid #E8E9ED",
                borderRadius: "10px",
                padding: 2,
              }}
            >
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <InfoRow label="tenant_id" value={tenant.tenant_id} mono />
                <InfoRow label="status" value={tenant.status} />
                <InfoRow label="name" value={tenant.name} />
                <InfoRow label="contact_email" value={tenant.contact_email} />
              </Box>
              {tenant.description && (
                <Box sx={{ mt: 2 }}>
                  <InfoRow label="description" value={tenant.description} />
                </Box>
              )}
            </Box>
          ) : (
            <>
              <Typography
                sx={{ fontFamily: "'Inter', sans-serif", color: "#666" }}
              >
                This allows creating <b>only 1 tenant</b>. Create it once,
                then manage projects under it.
              </Typography>

              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <AscendTextField
                  label="Name"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Acme Corp"
                  helperText={
                    tenantName.trim() && tenantName.trim().length < 3
                      ? "Min 3 chars"
                      : " "
                  }
                  error={!!tenantName.trim() && tenantName.trim().length < 3}
                />
                <AscendTextField
                  label="Contact Email"
                  required
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  placeholder="admin@acme.com"
                  helperText={
                    tenantEmail.trim() &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantEmail.trim())
                      ? "Invalid email"
                      : " "
                  }
                  error={
                    !!tenantEmail.trim() &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantEmail.trim())
                  }
                />
              </Box>
              <AscendTextField
                label="Description"
                value={tenantDescription}
                onChange={(e) => setTenantDescription(e.target.value)}
                placeholder="Primary account for Acme"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <AscendButton
                  onClick={onCreateTenant}
                  disabled={tenantCreateDisabled}
                >
                  {tenantCreating ? "Creating..." : "Create Tenant"}
                </AscendButton>
              </Box>
            </>
          )}
        </Box>

        {/* Project Configuration */}
        {selectedProject && (
          <>
            <Divider />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography
                sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                Project Configuration
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E0E0E0",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#F8F9FC",
                    padding: "16px 24px",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#33343E",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Project Configuration
                  </Typography>
                </Box>

                <Box sx={{ padding: "24px" }}>
                  <ConfigItem
                    label="Project Name"
                    value={selectedProject.name}
                  />
                  <ConfigItem
                    label="Project API"
                    value={
                      projectKeys[selectedProject.project_id]?.api_key_masked ||
                      "Not configured"
                    }
                    onCopy={() => {
                      const apiKey =
                        projectKeys[selectedProject.project_id]?.api_key;
                      if (apiKey) {
                        copyToClipboard(apiKey);
                        setSnackbar({
                          open: true,
                          message: "Project API copied to clipboard",
                          severity: "success",
                        });
                      }
                    }}
                    isLast
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}

        {/* Projects */}
        {tenantId && (
          <>
            <Divider />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                Projects
              </Typography>
              <Typography
                sx={{ fontFamily: "'Inter', sans-serif", color: "#666" }}
              >
                Group your ideas and experiments into <b>Projects</b> to keep
                things organized and easy to manage.
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <AscendButton onClick={() => setCreateProjectOpen(true)}>
                  Create Project
                </AscendButton>
              </Box>

              <Box
                sx={{
                  border: "1px solid #E8E9ED",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#F8F9FC" }}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        PROJECT NAME
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        PROJECT KEY
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>API KEY</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        DATE CREATED
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        DATE UPDATED
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 48 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Typography
                            sx={{
                              fontFamily: "'Inter', sans-serif",
                              color: "#666",
                            }}
                          >
                            No projects yet. Create one to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      projects.map((p) => {
                        const k = projectKeys[p.project_id];
                        const busy = !!rowBusy[p.project_id];
                        const isSelected =
                          selectedProject?.project_id === p.project_id;
                        return (
                          <TableRow
                            key={p.project_id}
                            hover
                            sx={{
                              cursor: "default",
                              backgroundColor: isSelected
                                ? theme.palette.primary.light
                                : "transparent",
                              "&:hover": {
                                backgroundColor: isSelected
                                  ? theme.palette.primary.light
                                  : "rgba(0, 96, 229, 0.08)",
                              },
                            }}
                          >
                            <TableCell
                              sx={{ fontWeight: 600, color: "#333" }}
                            >
                              {p.name}
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "monospace", fontSize: "12px" }}
                            >
                              {p.project_key}
                              <IconButton
                                size="small"
                                sx={{ marginLeft: 1 }}
                                onClick={() => {
                                  copyToClipboard(p.project_key);
                                  setSnackbar({
                                    open: true,
                                    message: "project_key copied",
                                    severity: "success",
                                  });
                                }}
                              >
                                <ContentCopyIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "monospace", fontSize: "12px" }}
                            >
                              {k ? (
                                <>
                                  {k.api_key_masked}
                                  <IconButton
                                    size="small"
                                    sx={{ marginLeft: 1 }}
                                    onClick={() => {
                                      copyToClipboard(k.api_key);
                                      setSnackbar({
                                        open: true,
                                        message: "masked api_key copied",
                                        severity: "success",
                                      });
                                    }}
                                  >
                                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </>
                              ) : k === null ? (
                                <Typography
                                  component="span"
                                  sx={{
                                    color: "#666",
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  No key
                                </Typography>
                              ) : (
                                <Typography
                                  component="span"
                                  sx={{
                                    color: "#666",
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  —
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "monospace", fontSize: "12px" }}
                            >
                              {formatDate(p.created_at)}
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "monospace", fontSize: "12px" }}
                            >
                              {formatDate(p.updated_at)}
                            </TableCell>
                            <TableCell align="right">
                              <AscendButton
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  // Always rotate the API key
                                  const keyId = k?.key_id;
                                  if (k && keyId) {
                                    onRotateProjectKey(p.project_id, keyId);
                                  } else {
                                    // This shouldn't happen since keys are auto-generated, but handle gracefully
                                    setSnackbar({
                                      open: true,
                                      message:
                                        "API key not found. Please refresh the page.",
                                      severity: "warning",
                                    });
                                  }
                                }}
                                disabled={busy || !k}
                                sx={{
                                  whiteSpace: "nowrap",
                                  "&.MuiButton-outlined": {
                                    borderWidth: "1px",
                                    "&:hover": {
                                      borderWidth: "1px",
                                    },
                                    "&:focus": {
                                      borderWidth: "1px",
                                    },
                                    "&:active": {
                                      borderWidth: "1px",
                                    },
                                  },
                                }}
                              >
                                {busy ? "Rotating..." : "Rotate Key"}
                              </AscendButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <AscendModal
        open={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        config={{
          title: "Create Project",
          width: 520,
          content: (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AscendTextField
                label="Project name"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Mobile iOS App"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <AscendButton
                  variant="outlined"
                  onClick={() => setCreateProjectOpen(false)}
                >
                  Cancel
                </AscendButton>
                <AscendButton
                  onClick={onCreateProject}
                  disabled={projectCreateDisabled}
                >
                  {projectCreating ? "Creating..." : "Create"}
                </AscendButton>
              </Box>
            </Box>
          ),
          showCloseButton: false,
        }}
      />

      <AscendModal
        open={secretModalOpen}
        onClose={() => setSecretModalOpen(false)}
        config={{
          title: secretModalTitle,
          description:
            "For security, the raw api_key is shown only once. Copy it now and store it securely.",
          width: 640,
          content: (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{ fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
                >
                  key_id:
                </Typography>
                <Typography sx={{ fontFamily: "monospace", fontSize: "12px" }}>
                  {rawKeyId || "—"}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    copyToClipboard(rawKeyId);
                    setSnackbar({
                      open: true,
                      message: "key_id copied",
                      severity: "success",
                    });
                  }}
                  disabled={!rawKeyId}
                >
                  <ContentCopyIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              <Box
                sx={{
                  border: "1px solid #E8E9ED",
                  borderRadius: "10px",
                  padding: 2,
                  backgroundColor: "#F8F9FC",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "13px",
                    wordBreak: "break-all",
                  }}
                >
                  {rawApiKey || "—"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <AscendButton
                  variant="outlined"
                  onClick={() => {
                    copyToClipboard(rawApiKey);
                    setSnackbar({
                      open: true,
                      message: "api_key copied",
                      severity: "success",
                    });
                  }}
                  disabled={!rawApiKey}
                >
                  Copy api_key
                </AscendButton>
                <AscendButton onClick={() => setSecretModalOpen(false)}>
                  Done
                </AscendButton>
              </Box>
            </Box>
          ),
          showCloseButton: false,
        }}
      />

      <AscendSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        autoHideDuration={2500}
      />
    </Box>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          color: "#33343E",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: mono ? "monospace" : "'Inter', sans-serif",
          fontSize: mono ? "12px" : "13px",
          color: "#666666",
          wordBreak: "break-all",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function ConfigItem({
  label,
  value,
  onCopy,
  isLast = false,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  isLast?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        paddingBottom: isLast ? 0 : "20px",
        marginBottom: isLast ? 0 : "20px",
        borderBottom: isLast ? "none" : "1px solid #F0F0F0",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: "#828592",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F8F9FC",
          borderRadius: "6px",
          border: "1px solid #E8E9ED",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#33343E",
            padding: "10px 14px",
            flex: 1,
            wordBreak: "break-all",
          }}
        >
          {value}
        </Typography>
        {onCopy && (
          <IconButton
            onClick={onCopy}
            sx={{
              borderRadius: "0",
              borderLeft: "1px solid #E8E9ED",
              padding: "10px 14px",
              color: "#828592",
              "&:hover": {
                backgroundColor: "#ECEDF1",
                color: "#33343E",
              },
            }}
          >
            <ContentCopyIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

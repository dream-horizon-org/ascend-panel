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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import AscendButton from "../../components/AscendButton/AscendButton";
import AscendModal from "../../components/AscendModal/AscendModal";
import AscendTextField from "../../components/AscendTextField/AscendTextField";
import AscendSnackbar from "../../components/AscendSnackbar/AscendSnackbar";
import {
  MockApiError,
  tenantManagementMockApi,
  TenantDetails,
  ProjectSummary,
} from "../../network/tenantManagement/mockApi";

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
  const [tenantDescription, setTenantDescription] = useState("Primary account for Acme");
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
          created_at: string;
          last_rotated_at: string;
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
    if (err instanceof MockApiError) {
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
      const resp = await tenantManagementMockApi.getTenants({ page: 1, limit: 1 });
      const first = resp.data.tenants[0];
      if (!first) {
        setTenant(null);
        return;
      }
      const details = await tenantManagementMockApi.getTenantDetails(first.tenant_id);
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
      const resp = await tenantManagementMockApi.getProjects(tId, {
        page: 1,
        limit: 50,
      });
      setProjects(resp.data.projects);
      
      // Load API keys for all projects immediately
      const keysPromises = resp.data.projects.map((p) =>
        tenantManagementMockApi.getProjectApiKey(tId, p.project_id).catch(() => null)
      );
      const keysResults = await Promise.all(keysPromises);
      const keysMap: Record<
        string,
        | {
            key_id: string;
            name: string;
            api_key_masked: string;
            created_at: string;
            last_rotated_at: string;
            status: string;
          }
        | null
        | undefined
      > = {};
      resp.data.projects.forEach((p, idx) => {
        keysMap[p.project_id] = keysResults[idx] || null;
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
      const k = await tenantManagementMockApi.getProjectApiKey(tId, projectId);
      setProjectKeys((prev) => ({ ...prev, [projectId]: k || null }));
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

  const onCreateTenant = async () => {
    try {
      setTenantCreating(true);
      const resp = await tenantManagementMockApi.createTenant({
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
      const resp = await tenantManagementMockApi.createProject(tenantId, {
        name: projectName,
      });
      
      // Fetch projects list to get the project_id
      const projectsResp = await tenantManagementMockApi.getProjects(tenantId, { page: 1, limit: 50 });
      const newProject = projectsResp.data.projects.find((p) => p.project_key === resp.data.project_key);
      
      // Automatically generate API key for the new project
      if (newProject) {
        try {
          const keyResp = await tenantManagementMockApi.generateApiKey(
            tenantId,
            newProject.project_id,
            { name: `${projectName} Key` },
          );
          // Show the raw key in modal since it's auto-generated
          setRawApiKey(keyResp.data.api_key);
          setRawKeyId(keyResp.data.key_id);
          setSecretModalTitle("API Key generated (shown once)");
          setSecretModalOpen(true);
        } catch (keyErr) {
          // If key generation fails, still show project created success
          console.error("Failed to auto-generate API key:", keyErr);
        }
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
      const resp = await tenantManagementMockApi.rotateApiKey(
        tenantId,
        projectId,
        keyId.trim(),
      );
      setRawApiKey(resp.data.api_key);
      setRawKeyId(resp.data.key_id);
      setSecretModalTitle("API Key rotated (shown once)");
      setSecretModalOpen(true);
      await refreshProjectKey(tenantId, projectId);
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

  const projectCreateDisabled = projectCreating || !tenantId || !projectName.trim();

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
          Tenant / Project Management (Mock)
        </Typography>
        <AscendButton
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={refreshTenant}
          disabled={tenantLoading}
        >
          Refresh
        </AscendButton>
      </Box>

      <Box sx={{ padding: "24px", display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Tenant */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            Tenant
          </Typography>
          {tenant ? (
            <Box sx={{ border: "1px solid #E8E9ED", borderRadius: "10px", padding: 2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
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
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
                This UI allows creating <b>only 1 tenant</b>. Create it once, then manage projects
                under it.
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <AscendTextField
                  label="Name"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Acme Corp"
                  helperText={tenantName.trim() && tenantName.trim().length < 3 ? "Min 3 chars" : " "}
                  error={!!tenantName.trim() && tenantName.trim().length < 3}
                />
                <AscendTextField
                  label="Contact Email"
                  required
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  placeholder="admin@acme.com"
                  helperText={
                    tenantEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantEmail.trim())
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
                <AscendButton onClick={onCreateTenant} disabled={tenantCreateDisabled}>
                  {tenantCreating ? "Creating..." : "Create Tenant"}
                </AscendButton>
              </Box>
            </>
          )}
        </Box>

        {/* Projects */}
        {tenantId && (
          <>
            <Divider />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                Projects
              </Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
                Group your ideas and experiments into <b>Projects</b> to keep things organized and easy
                to manage.
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <AscendButton variant="outlined" onClick={() => refreshProjects(tenantId)} disabled={projectsLoading}>
                  Refresh
                </AscendButton>
                <AscendButton onClick={() => setCreateProjectOpen(true)}>Create Project</AscendButton>
              </Box>

              <Box sx={{ border: "1px solid #E8E9ED", borderRadius: "10px", overflow: "hidden" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#F8F9FC" }}>
                      <TableCell sx={{ fontWeight: 600 }}>PROJECT NAME</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>PROJECT KEY</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 200 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>API KEY</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>DATE CREATED</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>DATE UPDATED</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 48 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: "#666" }}>
                            No projects yet. Create one to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      projects.map((p) => {
                        const k = projectKeys[p.project_id];
                        const busy = !!rowBusy[p.project_id];
                        return (
                          <TableRow
                            key={p.project_id}
                            hover
                            sx={{ cursor: "default" }}
                          >
                            <TableCell sx={{ fontWeight: 600, color: "#1976d2" }}>
                              {p.name}
                            </TableCell>
                            <TableCell sx={{ fontFamily: "monospace", fontSize: "12px" }}>
                              {p.project_key}
                            </TableCell>
                            <TableCell sx={{ fontFamily: "monospace", fontSize: "12px", width: 200, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                              {p.project_id}
                              <IconButton
                                size="small"
                                sx={{ marginLeft: 1 }}
                                onClick={() => {
                                  copyToClipboard(p.project_id);
                                  setSnackbar({ open: true, message: "project_id copied", severity: "success" });
                                }}
                              >
                                <ContentCopyIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ fontFamily: "monospace", fontSize: "12px" }}>
                              {k ? (
                                <>
                                  {k.api_key_masked}
                                  <IconButton
                                    size="small"
                                    sx={{ marginLeft: 1 }}
                                    onClick={() => {
                                      copyToClipboard(k.api_key_masked);
                                      setSnackbar({ open: true, message: "masked api_key copied", severity: "success" });
                                    }}
                                  >
                                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </>
                              ) : k === null ? (
                                <Typography component="span" sx={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
                                  No key
                                </Typography>
                              ) : (
                                <Typography component="span" sx={{ color: "#666", fontFamily: "'Inter', sans-serif" }}>
                                  —
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ fontFamily: "monospace", fontSize: "12px" }}>
                              {formatDate(p.created_at)}
                            </TableCell>
                            <TableCell sx={{ fontFamily: "monospace", fontSize: "12px" }}>
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
                                      message: "API key not found. Please refresh the page.",
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
          description:
            "Project key is derived from the name and must match ^[a-z0-9-]+$ (lowercase, no spaces).",
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
                <AscendButton variant="outlined" onClick={() => setCreateProjectOpen(false)}>
                  Cancel
                </AscendButton>
                <AscendButton onClick={onCreateProject} disabled={projectCreateDisabled}>
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
                <Typography sx={{ fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                  key_id:
                </Typography>
                <Typography sx={{ fontFamily: "monospace", fontSize: "12px" }}>
                  {rawKeyId || "—"}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    copyToClipboard(rawKeyId);
                    setSnackbar({ open: true, message: "key_id copied", severity: "success" });
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
                <Typography sx={{ fontFamily: "monospace", fontSize: "13px", wordBreak: "break-all" }}>
                  {rawApiKey || "—"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <AscendButton
                  variant="outlined"
                  onClick={() => {
                    copyToClipboard(rawApiKey);
                    setSnackbar({ open: true, message: "api_key copied", severity: "success" });
                  }}
                  disabled={!rawApiKey}
                >
                  Copy api_key
                </AscendButton>
                <AscendButton onClick={() => setSecretModalOpen(false)}>Done</AscendButton>
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

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
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



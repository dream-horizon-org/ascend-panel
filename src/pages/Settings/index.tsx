import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyIcon from "@mui/icons-material/Key";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AscendModal from "../../components/AscendModal/AscendModal";
import AscendDropdown from "../../components/AscendDropdown/AscendDropdown";
import AscendTextField from "../../components/AscendTextField/AscendTextField";

// Mock tenant options - replace with API data later
const MOCK_TENANTS = [
  "tenant-alpha",
  "tenant-beta",
  "tenant-gamma",
  "tenant-delta",
];

// Mock projects per tenant - replace with API data later
const MOCK_PROJECTS: Record<string, string[]> = {
  "tenant-alpha": ["mobile-ios-app", "web-dashboard", "api-backend"],
  "tenant-beta": ["checkout-service", "inventory-api"],
  "tenant-gamma": ["analytics-platform"],
  "tenant-delta": ["payment-gateway", "notification-service", "user-auth"],
};

// Mock API keys data - replace with API data later
interface ApiKeyData {
  key_id: string;
  project_id: string;
  project_key: string;
  name: string;
  status: "ACTIVE" | "REVOKED";
  created_at: string;
  last_rotated_at: string | null;
}

const MOCK_API_KEYS: ApiKeyData[] = [
  {
    key_id: "key_12345",
    project_id: "770e8400-alpha",
    project_key: "mobile-ios-app",
    name: "CI Pipeline Key",
    status: "ACTIVE",
    created_at: "2023-11-01T12:00:00Z",
    last_rotated_at: "2023-12-01T10:00:00Z",
  },
  {
    key_id: "key_67890",
    project_id: "770e8400-beta",
    project_key: "web-dashboard",
    name: "Production Key",
    status: "ACTIVE",
    created_at: "2023-10-15T09:30:00Z",
    last_rotated_at: null,
  },
  {
    key_id: "key_11111",
    project_id: "770e8400-gamma",
    project_key: "api-backend",
    name: "Staging Key",
    status: "REVOKED",
    created_at: "2023-09-20T14:45:00Z",
    last_rotated_at: "2023-11-15T16:20:00Z",
  },
  {
    key_id: "key_22222",
    project_id: "770e8400-delta",
    project_key: "checkout-service",
    name: "Development Key",
    status: "ACTIVE",
    created_at: "2023-12-05T11:00:00Z",
    last_rotated_at: null,
  },
];

export default function Settings() {
  // Create Project Modal State
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [projectNameError, setProjectNameError] = useState("");

  // API Key Modal State
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyTenant, setApiKeyTenant] = useState<string>("");
  const [apiKeyProject, setApiKeyProject] = useState<string>("");
  const [apiKeyName, setApiKeyName] = useState("");

  // API Key Success Modal State
  const [isApiKeySuccessModalOpen, setIsApiKeySuccessModalOpen] =
    useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState("");
  const [apiKeySuccessType, setApiKeySuccessType] = useState<
    "generated" | "rotated"
  >("generated");
  const [isCopied, setIsCopied] = useState(false);

  const validateProjectName = (name: string): boolean => {
    const regex = /^[a-z0-9-]+$/;
    if (!name) {
      setProjectNameError("Project name is required");
      return false;
    }
    if (!regex.test(name)) {
      setProjectNameError(
        "Only lowercase letters, numbers, and hyphens allowed (no spaces)",
      );
      return false;
    }
    setProjectNameError("");
    return true;
  };

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectName(value);
    if (value) {
      validateProjectName(value);
    } else {
      setProjectNameError("");
    }
  };

  const handleCreateProject = () => {
    if (!selectedTenant) {
      return;
    }
    if (!validateProjectName(projectName)) {
      return;
    }

    // TODO: Call API to create project
    console.log("Creating project:", {
      tenant_id: selectedTenant,
      name: projectName,
    });

    // Reset form and close modal
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsCreateProjectModalOpen(false);
    setSelectedTenant("");
    setProjectName("");
    setProjectNameError("");
  };

  // API Key Modal Handlers
  const handleGenerateApiKey = () => {
    if (!apiKeyTenant || !apiKeyProject) {
      return;
    }

    // TODO: Call API to generate API key
    console.log("Generating API key:", {
      tenant_id: apiKeyTenant,
      project_id: apiKeyProject,
      name: apiKeyName || undefined,
    });

    // Mock generated API key - replace with actual API response
    const mockApiKey = `exp_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Close generate modal and show success modal
    handleCloseApiKeyModal();
    setGeneratedApiKey(mockApiKey);
    setApiKeySuccessType("generated");
    setIsApiKeySuccessModalOpen(true);
  };

  const handleCloseApiKeyModal = () => {
    setIsApiKeyModalOpen(false);
    setApiKeyTenant("");
    setApiKeyProject("");
    setApiKeyName("");
  };

  const handleApiKeyTenantChange = (value: string) => {
    setApiKeyTenant(value);
    setApiKeyProject(""); // Reset project when tenant changes
  };

  const getProjectsForTenant = (tenant: string): string[] => {
    return MOCK_PROJECTS[tenant] || [];
  };

  // Handle rotate from table row
  const handleRotateKeyFromTable = (apiKey: ApiKeyData) => {
    // TODO: Call API to rotate API key directly
    console.log("Rotating API key from table:", {
      key_id: apiKey.key_id,
      project_id: apiKey.project_id,
      project_key: apiKey.project_key,
      name: apiKey.name,
    });

    // Mock rotated API key - replace with actual API response
    const mockRotatedApiKey = `exp_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Show success modal with new API key
    setGeneratedApiKey(mockRotatedApiKey);
    setApiKeySuccessType("rotated");
    setIsApiKeySuccessModalOpen(true);
  };

  // Handle copy API key
  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(generatedApiKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy API key:", err);
    }
  };

  // Handle close success modal
  const handleCloseSuccessModal = () => {
    setIsApiKeySuccessModalOpen(false);
    setGeneratedApiKey("");
    setIsCopied(false);
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography
        sx={{
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: "1.5rem",
          color: "#333333",
          mb: 3,
        }}
      >
        SETTINGS
      </Typography>

      {/* Projects Section */}
      <Box
        sx={{
          padding: "1.5rem",
          border: "1px solid #DADADD",
          borderRadius: "0.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#333333",
              }}
            >
              Projects
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "0.875rem",
                color: "#666666",
                mt: 0.5,
              }}
            >
              Create and manage projects for your tenants
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateProjectModalOpen(true)}
            sx={{
              backgroundColor: "#0060E5",
              color: "white",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              "&:hover": {
                backgroundColor: "#0050C5",
              },
            }}
          >
            Create Project
          </Button>
        </Box>
      </Box>

      {/* Create Project Modal */}
      <AscendModal
        open={isCreateProjectModalOpen}
        onClose={handleCloseModal}
        config={{
          title: "Create New Project",
          width: 480,
          showCloseButton: false,
          boxSx: {
            borderRadius: "0.75rem",
            border: "1px solid #DADADD",
          },
          children: (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Tenant Dropdown */}
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#333333",
                    mb: 1,
                  }}
                >
                  Tenant
                  <span style={{ color: "#EF4444", marginLeft: "2px" }}>*</span>
                </Typography>
                <AscendDropdown
                  options={MOCK_TENANTS}
                  value={selectedTenant}
                  onChange={(value) => setSelectedTenant(value as string)}
                  placeholder="Select a tenant"
                  fullWidth
                  size="md"
                />
              </Box>

              {/* Project Name Input */}
              <AscendTextField
                label="Project Name"
                required
                placeholder="e.g., mobile-ios-app"
                value={projectName}
                onChange={handleProjectNameChange}
                error={!!projectNameError}
                helperText={
                  projectNameError ||
                  "Only lowercase letters, numbers, and hyphens allowed"
                }
              />
            </Box>
          ),
          actions: (
            <>
              <Button
                variant="text"
                onClick={handleCloseModal}
                sx={{
                  color: "#666666",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0.5rem 1rem",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateProject}
                disabled={!selectedTenant || !projectName || !!projectNameError}
                sx={{
                  backgroundColor: "#0060E5",
                  color: "white",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "0.5rem",
                  "&:hover": {
                    backgroundColor: "#0050C5",
                  },
                  "&:disabled": {
                    backgroundColor: "#CCCCCC",
                    color: "#666666",
                  },
                }}
              >
                Create Project
              </Button>
            </>
          ),
        }}
      />

      {/* API Key Management Section */}
      <Box
        sx={{
          padding: "1.5rem",
          border: "1px solid #DADADD",
          borderRadius: "0.5rem",
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#333333",
              }}
            >
              API Key Management
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "0.875rem",
                color: "#666666",
                mt: 0.5,
              }}
            >
              Generate and manage API keys for your projects
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<KeyIcon />}
            onClick={() => setIsApiKeyModalOpen(true)}
            sx={{
              backgroundColor: "#0060E5",
              color: "white",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              "&:hover": {
                backgroundColor: "#0050C5",
              },
            }}
          >
            Generate API Key
          </Button>
        </Box>

        {/* API Keys Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#F9FAFB",
                  "& th": {
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    color: "#666666",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #DADADD",
                    padding: "0.75rem 1rem",
                  },
                }}
              >
                <TableCell>Key ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Last Rotated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_API_KEYS.map((apiKey) => (
                <TableRow
                  key={apiKey.key_id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "#F9FAFB" },
                    "& td": {
                      fontFamily: "Inter",
                      fontSize: "0.875rem",
                      color: "#333333",
                      padding: "1rem",
                      borderBottom: "1px solid #EAECEF",
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.8125rem",
                        color: "#0060E5",
                        backgroundColor: "#EBF3FE",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        display: "inline-block",
                      }}
                    >
                      {apiKey.key_id}
                    </Typography>
                  </TableCell>
                  <TableCell>{apiKey.name}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: "0.875rem",
                        color: "#666666",
                      }}
                    >
                      {apiKey.project_key}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={apiKey.status}
                      size="small"
                      sx={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        backgroundColor:
                          apiKey.status === "ACTIVE" ? "#DCFCE7" : "#FEE2E2",
                        color:
                          apiKey.status === "ACTIVE" ? "#166534" : "#991B1B",
                        borderRadius: "0.25rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(apiKey.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {apiKey.last_rotated_at
                      ? new Date(apiKey.last_rotated_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "—"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip
                      title={
                        apiKey.status === "REVOKED"
                          ? "Cannot rotate revoked key"
                          : "Rotate this key"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleRotateKeyFromTable(apiKey)}
                          disabled={apiKey.status === "REVOKED"}
                          sx={{
                            color: "#0060E5",
                            "&:hover": {
                              backgroundColor: "rgba(0, 96, 229, 0.08)",
                            },
                            "&:disabled": {
                              color: "#CCCCCC",
                            },
                          }}
                        >
                          <RotateRightIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Generate API Key Modal */}
      <AscendModal
        open={isApiKeyModalOpen}
        onClose={handleCloseApiKeyModal}
        config={{
          title: "Generate API Key",
          width: 480,
          showCloseButton: false,
          boxSx: {
            borderRadius: "0.75rem",
            border: "1px solid #DADADD",
          },
          children: (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Tenant Dropdown */}
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#333333",
                    mb: 1,
                  }}
                >
                  Tenant
                  <span style={{ color: "#EF4444", marginLeft: "2px" }}>*</span>
                </Typography>
                <AscendDropdown
                  options={MOCK_TENANTS}
                  value={apiKeyTenant}
                  onChange={(value) =>
                    handleApiKeyTenantChange(value as string)
                  }
                  placeholder="Select a tenant"
                  fullWidth
                  size="md"
                />
              </Box>

              {/* Project Dropdown */}
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#333333",
                    mb: 1,
                  }}
                >
                  Project
                  <span style={{ color: "#EF4444", marginLeft: "2px" }}>*</span>
                </Typography>
                <AscendDropdown
                  options={getProjectsForTenant(apiKeyTenant)}
                  value={apiKeyProject}
                  onChange={(value) => setApiKeyProject(value as string)}
                  placeholder={
                    apiKeyTenant ? "Select a project" : "Select a tenant first"
                  }
                  fullWidth
                  size="md"
                  disabled={!apiKeyTenant}
                />
              </Box>

              {/* API Key Name Input */}
              <AscendTextField
                label="Key Name (optional)"
                placeholder="e.g., CI Pipeline Key"
                value={apiKeyName}
                onChange={(e) => setApiKeyName(e.target.value)}
                helperText="If not provided, defaults to the project name"
              />
            </Box>
          ),
          actions: (
            <>
              <Button
                variant="text"
                onClick={handleCloseApiKeyModal}
                sx={{
                  color: "#666666",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0.5rem 1rem",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleGenerateApiKey}
                disabled={!apiKeyTenant || !apiKeyProject}
                sx={{
                  backgroundColor: "#0060E5",
                  color: "white",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "0.5rem",
                  "&:hover": {
                    backgroundColor: "#0050C5",
                  },
                  "&:disabled": {
                    backgroundColor: "#CCCCCC",
                    color: "#666666",
                  },
                }}
              >
                Generate Key
              </Button>
            </>
          ),
        }}
      />

      {/* API Key Success Modal */}
      <AscendModal
        open={isApiKeySuccessModalOpen}
        onClose={handleCloseSuccessModal}
        config={{
          title:
            apiKeySuccessType === "generated"
              ? "API Key Generated"
              : "API Key Rotated",
          width: 520,
          showCloseButton: false,
          closeOnBackdropClick: false,
          closeOnEscape: false,
          boxSx: {
            borderRadius: "0.75rem",
            border: "1px solid #DADADD",
          },
          children: (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: "#FEF3C7",
                  border: "1px solid #F59E0B",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#92400E",
                  }}
                >
                  ⚠️ Important: Copy your API key now
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.8125rem",
                    color: "#92400E",
                    mt: 0.5,
                  }}
                >
                  This is the only time you'll see this key. Store it securely.
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#333333",
                    mb: 1,
                  }}
                >
                  Your API Key
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #DADADD",
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      color: "#333333",
                      flex: 1,
                      wordBreak: "break-all",
                    }}
                  >
                    {generatedApiKey}
                  </Typography>
                  <Tooltip title={isCopied ? "Copied!" : "Copy to clipboard"}>
                    <IconButton
                      size="small"
                      onClick={handleCopyApiKey}
                      sx={{
                        color: isCopied ? "#16A34A" : "#0060E5",
                        backgroundColor: isCopied ? "#DCFCE7" : "#EBF3FE",
                        "&:hover": {
                          backgroundColor: isCopied ? "#BBF7D0" : "#DBEAFE",
                        },
                      }}
                    >
                      {isCopied ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <ContentCopyIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ),
          actions: (
            <Button
              variant="contained"
              onClick={handleCloseSuccessModal}
              sx={{
                backgroundColor: "#0060E5",
                color: "white",
                textTransform: "none",
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "0.875rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "0.5rem",
                "&:hover": {
                  backgroundColor: "#0050C5",
                },
              }}
            >
              Done
            </Button>
          ),
        }}
      />
    </Box>
  );
}

import { Box } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { useProject } from "../../context/ProjectContext";
import { STORAGE_KEYS } from "../../utils/contants";

const IFRAME_BASE_URL = "http://localhost:9001";

export default function IframePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProject } = useProject();

  const iframeOrigin = useMemo(
    () => new URL(IFRAME_BASE_URL).origin,
    []
  );

  // Build iframe URL with API key as parameter
  const iframeUrl = useMemo(() => {
    const apiKey = selectedProject?.api_key || localStorage.getItem(STORAGE_KEYS.PROJECT_API_KEY);
    if (apiKey) {
      return `${IFRAME_BASE_URL}?apiKey=${encodeURIComponent(apiKey)}`;
    }
    return IFRAME_BASE_URL;
  }, [selectedProject?.api_key]);

  // Handle messages from child iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== iframeOrigin) return;
      
      if (event.data?.type === "ROUTE_CHANGE") {
        const newPath = `/audience${event.data.path}`;

        if (location.pathname !== newPath) {
          navigate(newPath, { replace: true });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeOrigin, location.pathname, navigate]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <iframe
        src={iframeUrl}
        title="Audience"
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </Box>
  );
}

import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useMemo } from "react";

const IFRAME_BASE_URL = "http://localhost:5173";

export default function IframePage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const audiencePath = location.pathname.replace(/^\/audience\/?/, "");
  const iframeSrc = `${IFRAME_BASE_URL}/${audiencePath}`;
  const iframeOrigin = useMemo(() => new URL(IFRAME_BASE_URL).origin, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== iframeOrigin) return;
      
      if (event.data.type === "ROUTE_CHANGE" && event.data.path) {
        const newPanelPath = `/audience${event.data.path}`;
        if (location.pathname !== newPanelPath) {
          navigate(newPanelPath, { replace: true });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [location.pathname, navigate, iframeOrigin]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <iframe
        src={iframeSrc}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="External Content"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </Box>
  );
}


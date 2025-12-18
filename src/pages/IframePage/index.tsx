import { Box } from "@mui/material";

export default function IframePage() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <iframe
        src="http://localhost:5173/"
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


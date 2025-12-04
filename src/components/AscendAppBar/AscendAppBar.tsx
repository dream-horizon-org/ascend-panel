import {
  AppBar as MuiAppBar,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PowerSettingsNew as PowerSettingsNewIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function AppBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <MuiAppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        height: theme.customComponents.appBar.height,
        width: "100%",
        paddingLeft: theme.customComponents.appBar.padding,
        paddingRight: theme.customComponents.appBar.padding,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: theme.customComponents.appBar.innerHeight,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
        >
          <Box
            component="img"
            src="/Ascend-logo.png"
            alt="Ascend Logo"
            sx={{
              width: theme.customComponents.appBar.logoSize,
              height: theme.customComponents.appBar.logoSize,
              objectFit: "contain",
            }}
          />
          <Typography
            sx={{
              fontWeight: theme.customComponents.appBar.titleFontWeight,
              fontSize: theme.customComponents.appBar.titleFontSize,
              lineHeight: theme.customComponents.appBar.innerHeight,
            }}
          >
            Ascend
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme.customComponents.appBar.padding,
          }}
        >
          <Typography
            sx={{
              cursor: "pointer",
              fontSize: theme.customComponents.appBar.linkFontSize,
              fontWeight: theme.customComponents.appBar.linkFontWeight,
              lineHeight: theme.customComponents.appBar.innerHeight,
              padding: theme.customComponents.appBar.linkPadding,
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            Docs
          </Typography>
          <Typography
            sx={{
              cursor: "pointer",
              fontSize: theme.customComponents.appBar.linkFontSize,
              fontWeight: theme.customComponents.appBar.linkFontWeight,
              lineHeight: theme.customComponents.appBar.innerHeight,
              padding: theme.customComponents.appBar.linkPadding,
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            Feedback
          </Typography>
          <IconButton
            size="small"
            sx={{
              padding: 0,
              minWidth: "auto",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <PowerSettingsNewIcon
              sx={{
                width: theme.customComponents.appBar.logoSize,
                height: theme.customComponents.appBar.logoSize,
                fontSize: theme.customComponents.appBar.logoSize,
                color: theme.palette.text.primary,
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </MuiAppBar>
  );
}

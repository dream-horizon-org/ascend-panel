import { AppBar as MuiAppBar, Box, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export default function AppBar() {
  const theme = useTheme();

  return (
    <MuiAppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: theme.customColors.appBar.background,
        color: theme.customColors.appBar.text,
        height: '56px',
        width: '100%',
        paddingLeft: '12px',
        paddingRight: '12px',
        borderBottom: `1px solid ${theme.customColors.appBar.border}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Inner container - height 24px */}
      <Box
        sx={{
          width: '100%',
          height: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* LEFT BOX - Ascend Icon + Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: '24px',
              height: '24px',
              backgroundColor: theme.customColors.appBar.logoPlaceholder,
              borderRadius: '4px',
            }}
          />
          <Typography sx={{ fontWeight: 600, fontSize: '18px', lineHeight: '24px' }}>
            Ascend
          </Typography>
        </Box>

        {/* RIGHT BOX - Docs, Feedback, Power Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Typography 
            sx={{ 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px',
              padding: '4px 12px',
              '&:hover': { color: theme.customColors.appBar.linkHover }
            }}
          >
            Docs
          </Typography>
          <Typography 
            sx={{ 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px',
              padding: '4px 12px',
              '&:hover': { color: theme.customColors.appBar.linkHover }
            }}
          >
            Feedback
          </Typography>
          <IconButton 
            size="small"
            sx={{ 
              padding: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
              }
            }}
          >
            <PowerSettingsNewIcon sx={{ width: '24px', height: '24px', fontSize: '24px', color: theme.customColors.appBar.text }} />
          </IconButton>
        </Box>
      </Box>
    </MuiAppBar>
  );
}

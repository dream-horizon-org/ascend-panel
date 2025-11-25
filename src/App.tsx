import Layout from './components/Layout/Layout'
import { Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

function App() {
  const theme = useTheme()

  return (
    <Layout>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.customColors.text.heading, mb: 2 }}>
          Welcome to Ascend
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a tab from the sidebar to navigate
        </Typography>
      </Box>
    </Layout>
  )
}

export default App

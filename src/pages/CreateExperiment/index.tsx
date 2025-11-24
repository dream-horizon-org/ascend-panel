import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useNavigate } from 'react-router'
import AscendTextField from '../../components/AscendTextField/AscendTextField'

const CreateExperiment = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <Box>
      {/* Header with back button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={handleBack} aria-label="go back">
          <ArrowBackIcon 
            sx={{ 
              color: '#595959',
              fontSize: '1rem'
            }} 
          />
        </IconButton>
        <Typography 
          component="h1" 
          sx={{ 
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '1rem', // 16px
            color: '#333333'
          }}
        >
          New Experiment
        </Typography>
      </Box>

      {/* Page content */}
      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            padding: '1.5rem', // 24px
            border: '1px solid',
            borderColor: '#DADADD',
            borderRadius: '0.5rem' // 8px
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '1rem', // 16px
                color: '#333333'
              }}
            >
              Experiment Details
            </Typography>
            <InfoOutlinedIcon
              sx={{
                width: '1rem', // 8px
                height: '1rem', // 8px
                color: '#DADADA'
              }}
            />
          </Box>

          {/* Input Fields */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AscendTextField
              label="Experiment Name"
              placeholder="Enter Experiment Name"
              value={'IPL 2024 Experiment'}
              infoText="Provide a unique name for your experiment"
            />
            <AscendTextField
              label="Experiment ID"
              placeholder="Enter experiment id"
              value={'IPL-2024-Experiment'}
              infoText="Unique identifier for the experiment"
            />
          </Box>

          {/* Hypothesis Field */}
          <Box sx={{ mt: '1.5rem' }}>
            <AscendTextField
              label="Hypothesis"
              placeholder="Enter hypothesis"
              infoText="Describe the hypothesis for this experiment"
              value={'The hypothesis written by the user will come here and will take up as much space as it needs. Max 120 char limit'}
              
            />
          </Box>

          {/* Description Field */}
          <Box sx={{ mt: '1.5rem' }}>
            <AscendTextField
              label="Description (optional)"
              placeholder="Enter description"
              height='120px'
              value={'The description written by the user will come here and will take up as much space as it needs. We should have a 300 character limit on the description.'}
            />
          </Box>
        </Box>

        {/* Variants and Targeting Section */}
        <Box
          sx={{
            padding: '1.5rem', // 24px
            border: '1px solid',
            borderColor: '#DADADD',
            borderRadius: '0.5rem', // 8px
            mt: '1.5rem' // 24px gap from previous box
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '1rem', // 16px
                color: '#333333'
              }}
            >
              Variants and Targeting
            </Typography>
            <InfoOutlinedIcon
              sx={{
                width: '1rem',
                height: '1rem',
                color: '#DADADA'
              }}
            />
          </Box>

          {/* Content will go here */}
        </Box>

        {/* Advance Configuration Section */}
        <Box
          sx={{
            padding: '1.5rem', // 24px
            border: '1px solid',
            borderColor: '#DADADD',
            borderRadius: '0.5rem', // 8px
            mt: '1.5rem' // 24px gap from previous box
          }}
        >
          {/* Section Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '1rem', // 16px
                color: '#333333'
              }}
            >
              Advance Configuration
            </Typography>
            <InfoOutlinedIcon
              sx={{
                width: '1rem',
                height: '1rem',
                color: '#DADADA'
              }}
            />
          </Box>

          {/* Rate Limiting Field */}
          <Box>
            <AscendTextField
              label="Rate Limiting (optional)"
              placeholder="Enter rate"
              infoText="Set the maximum rate limit for this experiment"
              width="10%"
              value={'100%'}
            />
          </Box>

          {/* Maximum Users Field */}
          <Box sx={{ mt: '1.5rem' }}>
            <AscendTextField
              label="Maximum Users (optional)"
              placeholder="######"
              infoText="Set the maximum number of users for this experiment"
              width="10%"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CreateExperiment
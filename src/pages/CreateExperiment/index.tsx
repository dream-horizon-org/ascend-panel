import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import AscendTextFieldControlled from '../../components/AscendTextField/AscendTextFieldControlled'

// Form validation schema
const experimentSchema = z.object({
  experimentName: z.string().min(1, 'Experiment name is required'),
  experimentId: z.string().min(1, 'Experiment ID is required'),
  hypothesis: z.string().min(1, 'Hypothesis is required').max(120, 'Maximum 120 characters allowed'),
  description: z.string().max(300, 'Maximum 300 characters allowed').optional(),
  rateLimit: z.string().optional(),
  maxUsers: z.string().optional(),
})

type ExperimentFormData = z.infer<typeof experimentSchema>

const CreateExperiment = () => {
  const navigate = useNavigate()
  
  const {
    control,
    watch,
  } = useForm<ExperimentFormData>({
    resolver: zodResolver(experimentSchema),
    mode: 'onChange', // Validate on every change
    defaultValues: {
      experimentName: 'IPL 2024 Experiment',
      experimentId: 'IPL-2024-Experiment',
      hypothesis: 'The hypothesis written by the user will come here and will take up as much space as it needs. Max 120 char limit',
      description: 'The description written by the user will come here and will take up as much space as it needs. We should have a 300 character limit on the description.',
      rateLimit: '100%',
      maxUsers: '',
    },
  })

  // Watch all form values and log changes
  const formValues = watch()
  
  useEffect(() => {
    console.log('Form values changed:', formValues)
  }, [formValues])

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
            <AscendTextFieldControlled
              name="experimentName"
              control={control}
              label="Experiment Name"
              placeholder="Enter Experiment Name"
              infoText="Provide a unique name for your experiment"
            />
            <AscendTextFieldControlled
              name="experimentId"
              control={control}
              label="Experiment ID"
              placeholder="Enter experiment id"
              infoText="Unique identifier for the experiment"
            />
          </Box>

          {/* Hypothesis Field */}
          <Box sx={{ mt: '1.5rem' }}>
            <AscendTextFieldControlled
              name="hypothesis"
              control={control}
              label="Hypothesis"
              placeholder="Enter hypothesis"
              infoText="Describe the hypothesis for this experiment"
            />
          </Box>

          {/* Description Field */}
          <Box sx={{ mt: '1.5rem' }}>
            <AscendTextFieldControlled
              name="description"
              control={control}
              label="Description (optional)"
              placeholder="Enter description"
              height='120px'
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
            <AscendTextFieldControlled
              name="rateLimit"
              control={control}
              label="Rate Limiting (optional)"
              placeholder="Enter rate"
              infoText="Set the maximum rate limit for this experiment"
              width="10%"
            />
          </Box>

          {/* Maximum Users Field */}
          <Box sx={{ mt: '1.5rem' }}>
            <AscendTextFieldControlled
              name="maxUsers"
              control={control}
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
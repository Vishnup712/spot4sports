import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container, Box, Typography, Grid, Paper, Button, CircularProgress, Divider, Chip, MobileStepper } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import api from '../services/api'

function TurfDetail() {
  const [turf, setTurf] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchTurf = async () => {
      try {
        const response = await api.get(`/turfs/${id}`)
        setTurf(response.data)
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch turf details')
        setLoading(false)
      }
    }

    fetchTurf()
  }, [id, user, navigate])

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const maxSteps = turf?.images?.length || 0

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    )
  }

  if (!turf) {
    return (
      <Container>
        <Typography align="center">Turf not found</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={turf.images?.[activeStep] || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={turf.name}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
              {maxSteps > 1 && (
                <MobileStepper
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  sx={{
                    maxWidth: '100%',
                    flexGrow: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    '& .MuiMobileStepper-dot': {
                      bgcolor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '& .MuiMobileStepper-dotActive': {
                      bgcolor: 'white',
                    },
                  }}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === maxSteps - 1}
                      sx={{
                        color: 'white',
                        '&.Mui-disabled': {
                          color: 'rgba(255, 255, 255, 0.4)',
                        },
                        px: 2,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Next
                      <KeyboardArrowRight sx={{ color: 'inherit' }} />
                    </Button>
                  }
                  backButton={
                    <Button
                      size="small"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      sx={{
                        color: 'white',
                        '&.Mui-disabled': {
                          color: 'rgba(255, 255, 255, 0.4)',
                        },
                        px: 2,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      <KeyboardArrowLeft sx={{ color: 'inherit' }} />
                      Back
                    </Button>
                  }
                />
              )}
              {maxSteps > 1 && (
                <>
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                      '&.Mui-disabled': {
                        display: 'none',
                      },
                      minWidth: 'auto',
                      px: 1,
                      py: 5,
                      display: { xs: 'none', sm: 'flex' },
                    }}
                  >
                    <KeyboardArrowLeft sx={{ fontSize: 40 }} />
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                      '&.Mui-disabled': {
                        display: 'none',
                      },
                      minWidth: 'auto',
                      px: 1,
                      py: 5,
                      display: { xs: 'none', sm: 'flex' },
                    }}
                  >
                    <KeyboardArrowRight sx={{ fontSize: 40 }} />
                  </Button>
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {turf.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocationOnIcon color="action" />
              <Typography variant="body1">{turf.location}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <AccessTimeIcon color="action" />
              <Typography variant="body1">
                {turf.openTime || '9:00 AM'} - {turf.closeTime || '10:00 PM'}
              </Typography>
            </Box>
            <Typography variant="h6" color="primary" gutterBottom>
              ₹{turf.price} per hour
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" paragraph>
              {turf.description}
            </Typography>
            {turf.facilities?.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Facilities
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {turf.facilities.map((facility) => (
                    <Chip key={facility} label={facility} />
                  ))}
                </Box>
              </>
            )}
            <Button variant="contained" size="large" fullWidth onClick={() => navigate(`/book/${turf.id}`)}>
              Book Now
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default TurfDetail

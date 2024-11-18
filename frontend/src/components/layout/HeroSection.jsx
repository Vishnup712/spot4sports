import { Box, Container, Typography, Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import heroImage from '../../assets/images/hero.jpg'

function HeroSection() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        height: '80vh',
        width: '100%',
        position: 'relative',
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.6))',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} maxWidth="600px">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Find Your Perfect
            <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
              Sports Venue
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '500px',
              lineHeight: 1.5,
            }}
          >
            Book sports facilities instantly, connect with players, and be part of an active community.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/search')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 500,
              }}
            >
              Find Venues
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/community')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 500,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                },
              }}
            >
              Join Community
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default HeroSection

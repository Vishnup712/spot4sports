import { Container, Typography } from '@mui/material'
import HeroSection from '../components/layout/HeroSection'
import TurfList from '../components/turf/TurfList'

function Home() {
  return (
    <>
      <HeroSection />
      <Container component="main" maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Venues
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Discover top-rated sports facilities in your area
        </Typography>
        <TurfList />
      </Container>
    </>
  )
}

export default Home

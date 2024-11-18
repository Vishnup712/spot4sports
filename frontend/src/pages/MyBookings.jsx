import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container, Typography, Paper, Box, Grid, Card, CardContent, Button, CircularProgress, Chip } from '@mui/material'
import { format } from 'date-fns'
import api from '../services/api'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings')
        setBookings(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user, navigate])

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'CANCELLED':
        return 'error'
      default:
        return 'default'
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`)
      // Refresh bookings after cancellation
      const response = await api.get('/bookings')
      setBookings(response.data)
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No bookings found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Book a Turf
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {booking.turf.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {booking.turf.location}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip label={booking.status} color={getStatusColor(booking.status)} size="small" sx={{ mr: 1 }} />
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    Date: {format(new Date(booking.date), 'MMMM d, yyyy')}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Time: {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                  </Typography>
                  {booking.status === 'PENDING' && (
                    <Button variant="outlined" color="error" size="small" onClick={() => handleCancelBooking(booking.id)} sx={{ mt: 2 }}>
                      Cancel Booking
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default MyBookings

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { Container, Grid, Typography, Paper, Box, Button, CircularProgress, Card, CardContent, Select, MenuItem, FormControl, InputLabel, Divider, Chip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { toast } from 'react-toastify'
import api from '../services/api'

function TurfManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [turf, setTurf] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchTurfAndBookings = async () => {
      try {
        const turfResponse = await api.get(`/turfs/${id}`)
        const turfData = turfResponse.data

        if (turfData.ownerId !== user.id) {
          toast.error('Not authorized to manage this turf')
          navigate('/profile')
          return
        }

        // Sort bookings by date and time
        const sortedBookings = turfData.bookings.sort((a, b) => {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB
          }
          return new Date(a.startTime) - new Date(b.startTime)
        })

        setTurf(turfData)
        setBookings(sortedBookings)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching turf details:', error)
        toast.error('Failed to fetch turf details')
        navigate('/profile')
      }
    }

    fetchTurfAndBookings()
  }, [id, user, navigate])

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus })

      // Update local state
      setBookings((prevBookings) => prevBookings.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)))

      toast.success(`Booking ${newStatus.toLowerCase()}`)
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast.error('Failed to update booking status')
    }
  }

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Turf Details Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {turf.name}
          </Typography>
          <Button startIcon={<EditIcon />} variant="contained" onClick={() => navigate(`/edit-turf/${turf.id}`)}>
            Edit Turf
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom>
              <strong>Location:</strong> {turf.location}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Price:</strong> ₹{turf.price} per hour
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Timings:</strong> {turf.openTime} - {turf.closeTime}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Section */}
      <Typography variant="h5" gutterBottom>
        Bookings
      </Typography>
      <Grid container spacing={3}>
        {bookings.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No bookings yet
              </Typography>
            </Paper>
          </Grid>
        ) : (
          bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{format(new Date(booking.date), 'MMM d, yyyy')}</Typography>
                    <Chip label={booking.status} color={getStatusColor(booking.status)} size="small" />
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    Time: {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Booked by: {booking.user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Contact:{' '}
                    <a href={`mailto:${booking.user.email}`} style={{ color: '#4CAF50', textDecoration: 'none' }}>
                      {booking.user.email}
                    </a>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <FormControl fullWidth size="small">
                    <InputLabel>Update Status</InputLabel>
                    <Select value={booking.status} label="Update Status" onChange={(e) => handleStatusChange(booking.id, e.target.value)} disabled={booking.status === 'CANCELLED'}>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  )
}

export default TurfManage

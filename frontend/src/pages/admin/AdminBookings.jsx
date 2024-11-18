import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip, IconButton, Menu, MenuItem, Container } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import api from '../../services/api'

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings')
      setBookings(response.data)
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch bookings')
      setLoading(false)
    }
  }

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget)
    setSelectedBooking(booking)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedBooking(null)
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/bookings/${selectedBooking.id}/status`, { status: newStatus })
      toast.success('Booking status updated successfully')
      fetchBookings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking status')
    }
    handleMenuClose()
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h4" gutterBottom>
          Booking Management
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Turf</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.user.name}</TableCell>
                    <TableCell>{booking.turf.name}</TableCell>
                    <TableCell>{format(new Date(booking.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                    </TableCell>
                    <TableCell>₹{booking.totalPrice}</TableCell>
                    <TableCell>
                      <Chip label={booking.status} color={booking.status === 'CONFIRMED' ? 'success' : booking.status === 'PENDING' ? 'warning' : 'error'} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, booking)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleStatusChange('CONFIRMED')} disabled={selectedBooking?.status === 'CONFIRMED'}>
            Confirm Booking
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('CANCELLED')} disabled={selectedBooking?.status === 'CANCELLED'}>
            Cancel Booking
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  )
}

export default AdminBookings

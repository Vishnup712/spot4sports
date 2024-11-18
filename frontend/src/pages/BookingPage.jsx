import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Container, Paper, Typography, Box, Grid, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { format, addHours } from 'date-fns'
import api from '../services/api'

function BookingPage() {
  const [turf, setTurf] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [duration, setDuration] = useState(1)
  const { turfId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchTurf = async () => {
      try {
        const response = await api.get(`/turfs/${turfId}`)
        setTurf(response.data)
        setLoading(false)
      } catch (error) {
        toast.error('Failed to fetch turf details')
        setLoading(false)
      }
    }

    fetchTurf()
  }, [turfId, user, navigate])

  const handleStartTimeChange = (newTime) => {
    setStartTime(newTime)
    if (newTime) {
      setEndTime(addHours(newTime, duration))
    }
  }

  const handleDurationChange = (event) => {
    const newDuration = event.target.value
    setDuration(newDuration)
    if (startTime) {
      setEndTime(addHours(startTime, newDuration))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startTime || !endTime) {
      toast.error('Please select start and end time')
      return
    }

    try {
      const bookingData = {
        turfId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }

      await api.post('/bookings', bookingData)
      toast.success('Booking created successfully!')
      navigate('/bookings')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Book {turf.name}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DatePicker label="Select Date" value={selectedDate} onChange={(newValue) => setSelectedDate(newValue)} minDate={new Date()} slotProps={{ textField: { fullWidth: true } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker label="Start Time" value={startTime} onChange={handleStartTimeChange} slotProps={{ textField: { fullWidth: true } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Duration (hours)</InputLabel>
                  <Select value={duration} onChange={handleDurationChange}>
                    {[1, 2, 3, 4].map((hour) => (
                      <MenuItem key={hour} value={hour}>
                        {hour} {hour === 1 ? 'hour' : 'hours'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Typography>Total Price: ₹{turf.price * duration}</Typography>
          </Box>

          <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 3 }}>
            Confirm Booking
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default BookingPage

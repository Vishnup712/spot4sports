import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { Container, Paper, Typography, Box, TextField, Button, Grid, InputAdornment, Chip, FormControl, InputLabel, OutlinedInput } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import api from '../services/api'

function CreateTurf() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    openTime: null,
    closeTime: null,
    slotDuration: 60,
    facilities: [],
  })
  const [selectedImages, setSelectedImages] = useState([])
  const [facility, setFacility] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddFacility = (e) => {
    e.preventDefault()
    if (facility.trim() && !formData.facilities.includes(facility.trim())) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facility.trim()],
      }))
      setFacility('')
    }
  }

  const handleDeleteFacility = (facilityToDelete) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facilityToDelete),
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setSelectedImages(files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create FormData object
      const formDataToSend = new FormData()

      // Append basic fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('slotDuration', formData.slotDuration)

      // Append time fields if they exist
      if (formData.openTime) {
        formDataToSend.append('openTime', format(formData.openTime, 'HH:mm'))
      }
      if (formData.closeTime) {
        formDataToSend.append('closeTime', format(formData.closeTime, 'HH:mm'))
      }

      // Append facilities as JSON string
      formDataToSend.append('facilities', JSON.stringify(formData.facilities))

      // Append each image file
      selectedImages.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const response = await api.post('/turfs', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data) {
        toast.success('Turf created successfully!')
        navigate('/')
      }
    } catch (error) {
      console.error('Error creating turf:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Failed to create turf')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Turf
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required fullWidth label="Turf Name" name="name" value={formData.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Price per Hour"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Slot Duration (minutes)" name="slotDuration" type="number" value={formData.slotDuration} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Opening Time"
                  value={formData.openTime}
                  onChange={(newValue) => setFormData((prev) => ({ ...prev, openTime: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Closing Time"
                  value={formData.closeTime}
                  onChange={(newValue) => setFormData((prev) => ({ ...prev, closeTime: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth multiline rows={4} label="Description" name="description" value={formData.description} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Add Facilities</InputLabel>
                <OutlinedInput
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFacility(e)}
                  endAdornment={
                    <Button onClick={handleAddFacility} variant="contained" sx={{ ml: 1 }}>
                      Add
                    </Button>
                  }
                  label="Add Facilities"
                />
              </FormControl>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.facilities.map((f) => (
                  <Chip key={f} label={f} onDelete={() => handleDeleteFacility(f)} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected: {selectedImages.length} images
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? 'Creating...' : 'Create Turf'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default CreateTurf

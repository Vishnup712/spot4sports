import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { Container, Paper, Typography, Box, TextField, Button, Grid, InputAdornment, Chip, FormControl, InputLabel, OutlinedInput, CircularProgress } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { toast } from 'react-toastify'
import api from '../services/api'

function EditTurf() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [facility, setFacility] = useState('')
  const [selectedImages, setSelectedImages] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    openTime: null,
    closeTime: null,
    slotDuration: 60,
    facilities: [],
    images: [],
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchTurf = async () => {
      try {
        const response = await api.get(`/turfs/${id}`)
        const turf = response.data

        if (turf.ownerId !== user.id) {
          toast.error('Not authorized to edit this turf')
          navigate('/profile')
          return
        }

        setFormData({
          name: turf.name,
          location: turf.location,
          price: turf.price,
          description: turf.description,
          openTime: turf.openTime ? new Date(`2000-01-01T${turf.openTime}`) : null,
          closeTime: turf.closeTime ? new Date(`2000-01-01T${turf.closeTime}`) : null,
          slotDuration: turf.slotDuration || 60,
          facilities: turf.facilities || [],
          images: turf.images || [],
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching turf:', error)
        toast.error('Failed to fetch turf details')
        navigate('/profile')
      }
    }

    fetchTurf()
  }, [id, user, navigate])

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
    setSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Append basic fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('slotDuration', formData.slotDuration)

      // Append time fields
      if (formData.openTime) {
        formDataToSend.append('openTime', format(formData.openTime, 'HH:mm'))
      }
      if (formData.closeTime) {
        formDataToSend.append('closeTime', format(formData.closeTime, 'HH:mm'))
      }

      // Append facilities
      formDataToSend.append('facilities', JSON.stringify(formData.facilities))

      // Append existing images
      formDataToSend.append('existingImages', JSON.stringify(formData.images))

      // Append new images
      selectedImages.forEach((image) => {
        formDataToSend.append('images', image)
      })

      await api.put(`/turfs/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Turf updated successfully!')
      navigate('/profile')
    } catch (error) {
      console.error('Error updating turf:', error)
      toast.error(error.response?.data?.message || 'Failed to update turf')
    } finally {
      setSubmitting(false)
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Turf
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
              <Typography variant="subtitle2" gutterBottom>
                Current Images:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {formData.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`Turf image ${index + 1}`}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                ))}
              </Box>
              <Button variant="outlined" component="label" fullWidth>
                Upload New Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected new images: {selectedImages.length}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Turf'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default EditTurf

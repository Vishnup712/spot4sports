import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container, Paper, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import api from '../../services/api'

function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: '',
    location: '',
  })
  const [loading, setLoading] = useState(false)
  const [checkingProfile, setCheckingProfile] = useState(true)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const checkProfile = async () => {
      try {
        const response = await api.get('/community/players')
        const hasProfile = response.data.some((player) => player.userId === user.id)
        if (!hasProfile) {
          toast.error('Please create a player profile first')
          navigate('/community/create-profile')
        }
        setCheckingProfile(false)
      } catch (error) {
        console.error('Error checking profile:', error)
        toast.error('Something went wrong')
        navigate('/community')
      }
    }

    checkProfile()
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/community/posts', formData)
      toast.success('Post created successfully!')
      navigate('/community/posts')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  if (checkingProfile) {
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
          Create Post
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Share your thoughts or find players for your next game
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField required fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} sx={{ mb: 3 }} />

          <FormControl fullWidth required sx={{ mb: 3 }}>
            <InputLabel>Post Type</InputLabel>
            <Select name="type" value={formData.type} label="Post Type" onChange={handleChange}>
              <MenuItem value="PLAYER_NEEDED">Player Needed</MenuItem>
              <MenuItem value="TEAM_ANNOUNCEMENT">Team Announcement</MenuItem>
              <MenuItem value="GENERAL_DISCUSSION">General Discussion</MenuItem>
            </Select>
          </FormControl>

          <TextField required fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} sx={{ mb: 3 }} placeholder="Where is this relevant to?" />

          <TextField
            required
            fullWidth
            multiline
            rows={6}
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="Write your post content here..."
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/community/posts')} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default CreatePost

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container, Paper, Typography, Box, TextField, Button, Grid, Chip, FormControl, InputLabel, OutlinedInput, MenuItem, Select } from '@mui/material'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { SPORTS_CONFIG } from '../../constants/sports'

function CreatePlayerProfile() {
  const [formData, setFormData] = useState({
    position: '',
    phoneNumber: '',
    location: '',
    experience: '',
    bio: '',
    skills: [],
  })
  const [skill, setSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Striker', 'Winger', 'Center Back', 'Full Back']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }))
      setSkill('')
    }
  }

  const handleDeleteSkill = (skillToDelete) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToDelete),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/community/players', formData)
      toast.success('Player profile created successfully!')
      navigate('/community')
    } catch (error) {
      console.error('Error creating player profile:', error)
      toast.error(error.response?.data?.message || 'Failed to create player profile')
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
          Create Player Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Set up your player profile to join the community, participate in discussions, and connect with other players.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Sport</InputLabel>
                <Select name="sport" value={formData.sport} onChange={handleChange} label="Sport">
                  {Object.keys(SPORTS_CONFIG).map((sport) => (
                    <MenuItem key={sport} value={sport}>
                      {sport}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.sport}>
                <InputLabel>Position</InputLabel>
                <Select name="position" value={formData.position} onChange={handleChange} label="Position">
                  {formData.sport &&
                    SPORTS_CONFIG[formData.sport].positions.map((pos) => (
                      <MenuItem key={pos} value={pos}>
                        {pos}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField required fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter your contact number" />
            </Grid>

            <Grid item xs={12}>
              <TextField required fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Enter your preferred playing location" />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                placeholder="How many years have you been playing?"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Add Skills</InputLabel>
                <OutlinedInput
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                  endAdornment={
                    <Button onClick={handleAddSkill} variant="contained" sx={{ ml: 1 }}>
                      Add
                    </Button>
                  }
                  label="Add Skills"
                  placeholder="e.g., Dribbling, Shooting, etc."
                />
              </FormControl>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.sport &&
                  SPORTS_CONFIG[formData.sport].skills.map((skill) => (
                    <Chip key={skill} label={skill} onClick={() => handleAddSkill(skill)} variant={formData.skills.includes(skill) ? 'filled' : 'outlined'} />
                  ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself as a player..." />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default CreatePlayerProfile

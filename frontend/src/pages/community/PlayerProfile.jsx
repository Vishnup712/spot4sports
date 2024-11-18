import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import StarIcon from '@mui/icons-material/Star'
import EditIcon from '@mui/icons-material/Edit'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import api from '../../services/api'

function PlayerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchPlayer = async () => {
      try {
        const response = await api.get(`/community/players/${id}`)
        setPlayer(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching player:', error)
        toast.error('Failed to fetch player details')
        navigate('/community')
      }
    }

    fetchPlayer()
  }, [id, user, navigate])

  const handleRatePlayer = async () => {
    if (ratingValue === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)
    try {
      await api.post(`/community/players/${id}/rate`, {
        value: ratingValue,
        comment: ratingComment,
      })

      // Refresh player data to get updated ratings
      const response = await api.get(`/community/players/${id}`)
      setPlayer(response.data)
      setRatingDialogOpen(false)
      toast.success('Rating submitted successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/community/players/${id}/update-status`, {
        availability: newStatus,
      })
      setPlayer((prev) => ({ ...prev, availability: newStatus }))
      setIsEditing(false)
      toast.success('Status updated successfully')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!player) {
    return (
      <Container>
        <Typography align="center">Player not found</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Player Info Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {player.user.name}
                </Typography>
                {player.userId === user?.id ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isEditing ? (
                      <FormControl size="small">
                        <InputLabel>Status</InputLabel>
                        <Select value={newStatus} label="Status" onChange={(e) => setNewStatus(e.target.value)} autoWidth>
                          <MenuItem value="AVAILABLE">Available</MenuItem>
                          <MenuItem value="BUSY">Busy</MenuItem>
                          <MenuItem value="AWAY">Away</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip
                        label={player.availability}
                        color={player.availability === 'AVAILABLE' ? 'success' : 'default'}
                        onClick={() => {
                          setNewStatus(player.availability)
                          setIsEditing(true)
                        }}
                        onDelete={() => {
                          setNewStatus(player.availability)
                          setIsEditing(true)
                        }}
                        deleteIcon={<EditIcon />}
                      />
                    )}
                    {isEditing && (
                      <>
                        <Button size="small" onClick={handleStatusUpdate}>
                          Save
                        </Button>
                        <Button size="small" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </Box>
                ) : (
                  <Chip label={player.availability} color={player.availability === 'AVAILABLE' ? 'success' : 'default'} />
                )}
                <Chip label={player.position} />
              </Box>
              {user.id !== player.userId && (
                <Button variant="contained" onClick={() => setRatingDialogOpen(true)}>
                  Rate Player
                </Button>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocationOnIcon color="action" />
                <Typography>{player.location}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PhoneIcon color="action" />
                <Typography>{player.phoneNumber}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="action" />
                <Typography>{player.user.email}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography paragraph>{player.bio || 'No bio provided'}</Typography>

            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {player.skills.map((skill, index) => (
                <Chip key={index} label={skill} variant="outlined" />
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary">
              Experience: {player.experience} {player.experience === 1 ? 'year' : 'years'}
            </Typography>
          </Paper>
        </Grid>

        {/* Ratings Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {player.rating.toFixed(1)} ({player.totalRatings} {player.totalRatings === 1 ? 'rating' : 'ratings'})
              </Typography>
            </Box>
            <Rating value={player.rating} precision={0.5} readOnly size="large" sx={{ mb: 3 }} />

            <Typography variant="h6" gutterBottom>
              Recent Reviews
            </Typography>
            {player.receivedRatings.length === 0 ? (
              <Typography color="text.secondary">No reviews yet</Typography>
            ) : (
              player.receivedRatings.map((rating) => (
                <Box key={rating.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2">{rating.fromPlayer.user.name}</Typography>
                    <Rating value={rating.value} size="small" readOnly />
                  </Box>
                  {rating.comment && <Typography variant="body2">{rating.comment}</Typography>}
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(rating.createdAt), 'MMM d, yyyy')}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
        <DialogTitle>Rate {player.user.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Rating
              value={ratingValue}
              onChange={(event, newValue) => {
                setRatingValue(newValue)
              }}
              size="large"
            />
            <TextField label="Comment (optional)" multiline rows={4} value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRatePlayer} variant="contained" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PlayerProfile

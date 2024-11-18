import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Grid, Typography, Paper, Box, Button, CircularProgress, Card, CardContent, CardMedia, CardActions, Chip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LogoutIcon from '@mui/icons-material/Logout'
import GroupIcon from '@mui/icons-material/Group'
import { toast } from 'react-toastify'
import api from '../services/api'
import { logout } from '../features/auth/authSlice'

function UserProfile() {
  const [userTurfs, setUserTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [playerProfile, setPlayerProfile] = useState(null)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchUserData = async () => {
      try {
        const turfsResponse = await api.get('/turfs')
        const filteredTurfs = turfsResponse.data.filter((turf) => turf.ownerId === user.id)
        setUserTurfs(filteredTurfs)

        const playersResponse = await api.get('/community/players')
        const userProfile = playersResponse.data.find((player) => player.userId === user.id)
        setPlayerProfile(userProfile)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch user data')
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, navigate])

  const handleEditTurf = (event, turfId) => {
    event.stopPropagation()
    navigate(`/edit-turf/${turfId}`)
  }

  const handleDeleteTurf = async (event, turfId) => {
    event.stopPropagation()
    if (window.confirm('Are you sure you want to delete this turf?')) {
      try {
        await api.delete(`/turfs/${turfId}`)
        setUserTurfs((prevTurfs) => prevTurfs.filter((turf) => turf.id !== turfId))
        toast.success('Turf deleted successfully')
      } catch (error) {
        console.error('Error deleting turf:', error)
        toast.error('Failed to delete turf')
      }
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
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
      {/* User Info Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ mt: 1 }}>
            Logout
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> {user.role}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* My Turfs Section */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          My Turfs
        </Typography>
        {userTurfs.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You haven't created any turfs yet
            </Typography>
            <Button variant="contained" onClick={() => navigate('/create-turf')}>
              Create New Turf
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {userTurfs.map((turf) => (
              <Grid item xs={12} md={6} lg={4} key={turf.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onClick={() => navigate(`/manage-turf/${turf.id}`)}
                >
                  <CardMedia component="img" height="200" image={turf.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'} alt={turf.name} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {turf.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {turf.location}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      ₹{turf.price} per hour
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1 }}>
                      {turf.facilities.map((facility, index) => (
                        <Chip key={index} label={facility} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<EditIcon />} onClick={(event) => handleEditTurf(event, turf.id)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={(event) => handleDeleteTurf(event, turf.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Player Profile Section */}
      <Box sx={{ mb: 4 }}>
        {playerProfile ? (
          <Button variant="contained" startIcon={<GroupIcon />} onClick={() => navigate(`/community/player/${playerProfile.id}`)} sx={{ mt: 2 }}>
            View Player Profile
          </Button>
        ) : (
          <Button variant="contained" startIcon={<GroupIcon />} onClick={() => navigate('/community/create-profile')} sx={{ mt: 2 }}>
            Create Player Profile
          </Button>
        )}
      </Box>
    </Container>
  )
}

export default UserProfile

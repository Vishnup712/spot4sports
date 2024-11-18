import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PostAddIcon from '@mui/icons-material/PostAdd'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { SPORTS_CONFIG } from '../../constants/sports'

function Community() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    sport: '',
    position: '',
    availability: '',
  })
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        // Check if user has a player profile
        const profileResponse = await api.get('/community/players')
        const userProfile = profileResponse.data.find((player) => player.userId === user.id)
        setHasProfile(!!userProfile)

        // Fetch all players
        const response = await api.get('/community/players')
        setPlayers(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch players')
        setLoading(false)
      }
    }

    fetchData()
  }, [user, navigate])

  const handleSearch = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        ...(searchQuery && { location: searchQuery }),
        ...(filters.position && { position: filters.position }),
        ...(filters.availability && { availability: filters.availability }),
      }).toString()

      const response = await api.get(`/community/players/search?${queryParams}`)
      setPlayers(response.data)
    } catch (error) {
      toast.error('Error searching players')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Striker', 'Winger', 'Center Back', 'Full Back']
  const availabilityOptions = ['AVAILABLE', 'BUSY', 'AWAY']

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Players Community</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!hasProfile ? (
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => navigate('/community/create-profile')}>
              Create Profile
            </Button>
          ) : (
            <Button variant="contained" startIcon={<PostAddIcon />} onClick={() => navigate('/community/posts/create')}>
              Create Post
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate('/community/posts')}>
            View Posts
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sport</InputLabel>
              <Select value={filters.sport} label="Sport" onChange={(e) => handleFilterChange('sport', e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {Object.keys(SPORTS_CONFIG).map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth disabled={!filters.sport}>
              <InputLabel>Position</InputLabel>
              <Select value={filters.position} label="Position" onChange={(e) => handleFilterChange('position', e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {filters.sport &&
                  SPORTS_CONFIG[filters.sport].positions.map((pos) => (
                    <MenuItem key={pos} value={pos}>
                      {pos}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select value={filters.availability} label="Availability" onChange={(e) => handleFilterChange('availability', e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {availabilityOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="contained" fullWidth onClick={handleSearch} sx={{ height: '56px' }}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Players List */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {players.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No players found</Typography>
              </Paper>
            </Grid>
          ) : (
            players.map((player) => (
              <Grid item xs={12} sm={6} md={4} key={player.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onClick={() => navigate(`/community/player/${player.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {player.user.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip label={player.availability} color={player.availability === 'AVAILABLE' ? 'success' : 'default'} size="small" sx={{ mr: 1 }} />
                      <Chip label={player.position} size="small" />
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {player.location}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Rating value={player.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({player.totalRatings} ratings)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {player.skills.slice(0, 3).map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" />
                      ))}
                      {player.skills.length > 3 && <Chip label={`+${player.skills.length - 3}`} size="small" variant="outlined" />}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View Profile</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  )
}

export default Community

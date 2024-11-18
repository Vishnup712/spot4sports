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
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import api from '../../services/api'

function CommunityPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    location: '',
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

        // Fetch all posts
        const response = await api.get('/community/posts')
        setPosts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching posts:', error)
        toast.error('Failed to fetch posts')
        setLoading(false)
      }
    }

    fetchData()
  }, [user, navigate])

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'PLAYER_NEEDED':
        return 'error'
      case 'TEAM_ANNOUNCEMENT':
        return 'primary'
      default:
        return 'default'
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesType = !filters.type || post.type === filters.type
    const matchesLocation = !filters.location || post.location.toLowerCase().includes(filters.location.toLowerCase())
    const matchesSearch = !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesLocation && matchesSearch
  })

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Community Posts</Typography>
        {hasProfile ? (
          <Button variant="contained" onClick={() => navigate('/community/posts/create')}>
            Create Post
          </Button>
        ) : (
          <Button variant="contained" onClick={() => navigate('/community/create-profile')}>
            Create Profile to Post
          </Button>
        )}
      </Box>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search posts..."
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Post Type</InputLabel>
              <Select value={filters.type} label="Post Type" onChange={(e) => handleFilterChange('type', e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PLAYER_NEEDED">Player Needed</MenuItem>
                <MenuItem value="TEAM_ANNOUNCEMENT">Team Announcement</MenuItem>
                <MenuItem value="GENERAL_DISCUSSION">General Discussion</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Filter by Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Posts List */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPosts.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No posts found</Typography>
              </Paper>
            </Grid>
          ) : (
            filteredPosts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onClick={() => navigate(`/community/posts/${post.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{post.title}</Typography>
                      <Chip label={post.type.replace('_', ' ')} color={getPostTypeColor(post.type)} size="small" />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.content}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {post.player.user.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {post.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small">
                      {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                    </Button>
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

export default CommunityPosts

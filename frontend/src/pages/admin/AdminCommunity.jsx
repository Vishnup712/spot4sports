import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip, IconButton, Menu, MenuItem, Container } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import api from '../../services/api'

function AdminCommunity() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [posts, setPosts] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    fetchCommunityData()
  }, [])

  const fetchCommunityData = async () => {
    try {
      const response = await api.get('/admin/community-stats')
      setStats(response.data.stats)
      setPosts(response.data.recentPosts)
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch community data')
      setLoading(false)
    }
  }

  const handleMenuClick = (event, post) => {
    setAnchorEl(event.currentTarget)
    setSelectedPost(post)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedPost(null)
  }

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/community/posts/${selectedPost.id}`)
        toast.success('Post deleted successfully')
        fetchCommunityData()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete post')
      }
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
          Community Management
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">{stats.totalPlayers}</Typography>
              <Typography color="text.secondary">Total Players</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">{stats.totalPosts}</Typography>
              <Typography color="text.secondary">Total Posts</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">{stats.totalComments}</Typography>
              <Typography color="text.secondary">Total Comments</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">{stats.totalRatings}</Typography>
              <Typography color="text.secondary">Total Ratings</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Posts Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.player.user.name}</TableCell>
                    <TableCell>
                      <Chip label={post.type.replace('_', ' ')} color={post.type === 'PLAYER_NEEDED' ? 'error' : post.type === 'TEAM_ANNOUNCEMENT' ? 'primary' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>{format(new Date(post.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, post)}>
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
          <MenuItem onClick={() => window.open(`/community/posts/${selectedPost?.id}`, '_blank')}>View Post</MenuItem>
          <MenuItem onClick={handleDeletePost} sx={{ color: 'error.main' }}>
            Delete Post
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  )
}

export default AdminCommunity

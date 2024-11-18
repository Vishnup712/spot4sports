import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container, Paper, Typography, Box, Button, TextField, Chip, CircularProgress, Divider, Avatar } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import api from '../../services/api'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
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

        // Fetch post details
        const response = await api.get(`/community/posts/${id}`)
        setPost(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching post:', error)
        toast.error('Failed to fetch post details')
        navigate('/community/posts')
      }
    }

    fetchData()
  }, [id, user, navigate])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    try {
      const response = await api.post(`/community/posts/${id}/comments`, {
        content: comment,
      })
      setPost((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data],
      }))
      setComment('')
      toast.success('Comment added successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment')
    } finally {
      setSubmitting(false)
    }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!post) {
    return (
      <Container>
        <Typography align="center">Post not found</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Post Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4">{post.title}</Typography>
            <Chip label={post.type.replace('_', ' ')} color={getPostTypeColor(post.type)} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
            <Typography variant="body2" color="text.secondary">
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </Typography>
          </Box>
        </Box>

        {/* Post Content */}
        <Typography paragraph sx={{ mb: 4 }}>
          {post.content}
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Comments Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>

          {hasProfile ? (
            <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 4 }}>
              <TextField fullWidth multiline rows={3} placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} sx={{ mb: 2 }} />
              <Button type="submit" variant="contained" disabled={submitting || !comment.trim()}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ mb: 4 }}>
              <Typography color="text.secondary" gutterBottom>
                Create a player profile to comment on posts
              </Typography>
              <Button variant="contained" onClick={() => navigate('/community/create-profile')}>
                Create Profile
              </Button>
            </Box>
          )}

          {/* Comments List */}
          {post.comments.length === 0 ? (
            <Typography color="text.secondary">No comments yet</Typography>
          ) : (
            post.comments.map((comment) => (
              <Paper
                key={comment.id}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: 'background.default',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>{comment.player.user.name[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle2">{comment.player.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
              </Paper>
            ))
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default PostDetail

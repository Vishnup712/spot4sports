import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip, IconButton, Menu, MenuItem, Container } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'

function AdminTurfs() {
  const [turfs, setTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTurf, setSelectedTurf] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTurfs()
  }, [])

  const fetchTurfs = async () => {
    try {
      const response = await api.get('/admin/turfs')
      setTurfs(response.data)
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch turfs')
      setLoading(false)
    }
  }

  const handleMenuClick = (event, turf) => {
    setAnchorEl(event.currentTarget)
    setSelectedTurf(turf)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTurf(null)
  }

  const handleViewDetails = () => {
    navigate(`/turfs/${selectedTurf.id}`)
    handleMenuClose()
  }

  const handleEdit = () => {
    navigate(`/edit-turf/${selectedTurf.id}`)
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (window.confirm('This turf has active bookings. Deleting it will affect those bookings. Do you want to proceed?')) {
      try {
        await api.delete(`/turfs/${selectedTurf.id}`)
        toast.success('Turf deleted successfully')
        fetchTurfs()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete turf')
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
          Turf Management
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total Bookings</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {turfs.map((turf) => (
                  <TableRow key={turf.id}>
                    <TableCell>{turf.name}</TableCell>
                    <TableCell>{turf.location}</TableCell>
                    <TableCell>{turf.owner.name}</TableCell>
                    <TableCell>₹{turf.price}/hr</TableCell>
                    <TableCell>
                      <Chip label={`${turf.confirmedBookings}/${turf.totalBookings}`} color="primary" size="small" />
                    </TableCell>
                    <TableCell>₹{turf.revenue}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, turf)}>
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
          <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  )
}

export default AdminTurfs

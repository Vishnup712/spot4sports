import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip, IconButton, Menu, MenuItem, Container } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { toast } from 'react-toastify'
import api from '../../services/api'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users')
      setLoading(false)
    }
  }

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleRoleChange = async (newRole) => {
    try {
      await api.put(`/admin/users/${selectedUser.id}/role`, { role: newRole })
      toast.success('User role updated successfully')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user role')
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
          User Management
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Turfs</TableCell>
                  <TableCell>Bookings</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} color={user.role === 'ADMIN' ? 'primary' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>{user.turfs?.length || 0}</TableCell>
                    <TableCell>{user.bookings?.length || 0}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, user)}>
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
          <MenuItem onClick={() => handleRoleChange(selectedUser?.role === 'ADMIN' ? 'USER' : 'ADMIN')}>Make {selectedUser?.role === 'ADMIN' ? 'User' : 'Admin'}</MenuItem>
        </Menu>
      </Box>
    </Container>
  )
}

export default AdminUsers

import { useState, useEffect } from 'react'
import { Grid, Paper, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Container } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import SportsIcon from '@mui/icons-material/Sports'
import BookingsIcon from '@mui/icons-material/BookOnline'
import MoneyIcon from '@mui/icons-material/AttachMoney'
import GroupsIcon from '@mui/icons-material/Groups'
import ForumIcon from '@mui/icons-material/Forum'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import StatsCard from '../../components/admin/StatsCard'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats')
        setStats(response.data.stats)
        setRecentBookings(response.data.recentBookings)
        setLoading(false)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data')
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
          Dashboard Overview
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Total Users" value={stats.totalUsers} icon={<PeopleIcon fontSize="large" />} color="#4CAF50" onClick={() => navigate('/admin/users')} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Total Turfs" value={stats.totalTurfs} icon={<SportsIcon fontSize="large" />} color="#2196F3" onClick={() => navigate('/admin/turfs')} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Total Bookings" value={stats.totalBookings} icon={<BookingsIcon fontSize="large" />} color="#FF9800" onClick={() => navigate('/admin/bookings')} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<MoneyIcon fontSize="large" />} color="#E91E63" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Total Players" value={stats.totalPlayers} icon={<GroupsIcon fontSize="large" />} color="#9C27B0" onClick={() => navigate('/admin/community')} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Total Posts" value={stats.totalPosts} icon={<ForumIcon fontSize="large" />} color="#00BCD4" onClick={() => navigate('/admin/community')} />
          </Grid>
        </Grid>

        {/* Recent Bookings */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Bookings
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Turf</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.user.name}</TableCell>
                    <TableCell>{booking.turf.name}</TableCell>
                    <TableCell>{format(new Date(booking.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Chip label={booking.status} color={booking.status === 'CONFIRMED' ? 'success' : booking.status === 'PENDING' ? 'warning' : 'error'} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  )
}

export default AdminDashboard

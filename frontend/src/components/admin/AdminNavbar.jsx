import { Box, Container, Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import SportsIcon from '@mui/icons-material/Sports'
import BookingsIcon from '@mui/icons-material/BookOnline'
import CommunityIcon from '@mui/icons-material/Forum'

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Turfs', icon: <SportsIcon />, path: '/admin/turfs' },
  { text: 'Bookings', icon: <BookingsIcon />, path: '/admin/bookings' },
  { text: 'Community', icon: <CommunityIcon />, path: '/admin/community' },
]

function AdminNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              variant={location.pathname === item.path ? 'contained' : 'text'}
              sx={{
                color: location.pathname === item.path ? 'white' : 'text.secondary',
                minWidth: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default AdminNavbar

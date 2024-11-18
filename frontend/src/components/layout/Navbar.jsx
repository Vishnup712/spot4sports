import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppBar, Box, Toolbar, Typography, Button, Container, InputBase, IconButton, Paper, Menu, MenuItem } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import PersonIcon from '@mui/icons-material/Person'
import GroupsIcon from '@mui/icons-material/Groups'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = (path) => {
    navigate(path)
    handleMenuClose()
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: { xs: '80px', md: '90px' }, gap: 1 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              cursor: 'pointer',
              fontWeight: 600,
              letterSpacing: 0.5,
              flexShrink: 0,
              mr: { xs: 1, md: 3 },
            }}
            onClick={() => navigate('/')}
          >
            Spot4Sports
          </Typography>

          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', md: '400px' },
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              },
              '&:focus-within': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)',
              },
            }}
            elevation={0}
          >
            <InputBase
              sx={{
                ml: 2,
                flex: 1,
                color: 'inherit',
                '& input': {
                  padding: '8px 0',
                  fontSize: '0.95rem',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
              }}
              placeholder="Search by location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton
              type="submit"
              sx={{
                p: '10px',
                color: 'inherit',
                mr: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Paper>

          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            {user ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<GroupsIcon />}
                  onClick={() => navigate('/community')}
                  sx={{
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                    display: { xs: 'none', sm: 'flex' },
                  }}
                >
                  Community
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  onClick={handleMenuOpen}
                  sx={{
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Menu
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleMenuClick('/profile')}>
                    <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('/create-turf')}>
                    <AddBusinessIcon sx={{ mr: 1 }} /> Create Turf
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('/bookings')}>
                    <BookOnlineIcon sx={{ mr: 1 }} /> My Bookings
                  </MenuItem>
                  {user?.role === 'ADMIN' && (
                    <MenuItem onClick={() => handleMenuClick('/admin')}>
                      <DashboardIcon sx={{ mr: 1 }} /> Admin Panel
                    </MenuItem>
                  )}
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/register')}
                  sx={{
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'primary.light' },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar

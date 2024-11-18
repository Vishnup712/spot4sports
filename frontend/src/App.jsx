import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TurfDetail from './pages/TurfDetail'
import BookingPage from './pages/BookingPage'
import CreateTurf from './pages/CreateTurf'
import MyBookings from './pages/MyBookings'
import Search from './pages/Search'
import UserProfile from './pages/UserProfile'
import EditTurf from './pages/EditTurf'
import TurfManage from './pages/TurfManage'
import Community from './pages/community/Community'
import CreatePlayerProfile from './pages/community/CreatePlayerProfile'
import PlayerProfile from './pages/community/PlayerProfile'
import CommunityPosts from './pages/community/CommunityPosts'
import CreatePost from './pages/community/CreatePost'
import PostDetail from './pages/community/PostDetail'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTurfs from './pages/admin/AdminTurfs'
import AdminBookings from './pages/admin/AdminBookings'
import AdminCommunity from './pages/admin/AdminCommunity'
import ProtectedRoute from './components/common/ProtectedRoute'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    secondary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#FFFFFF',
    },
    subtitle1: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-outlined': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/turfs/:id" element={<TurfDetail />} />
            <Route path="/book/:turfId" element={<BookingPage />} />
            <Route path="/create-turf" element={<CreateTurf />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/edit-turf/:id" element={<EditTurf />} />
            <Route path="/manage-turf/:id" element={<TurfManage />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/create-profile" element={<CreatePlayerProfile />} />
            <Route path="/community/player/:id" element={<PlayerProfile />} />
            <Route path="/community/posts" element={<CommunityPosts />} />
            <Route path="/community/posts/create" element={<CreatePost />} />
            <Route path="/community/posts/:id" element={<PostDetail />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/turfs"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminTurfs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/community"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminCommunity />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer position="bottom-right" theme="colored" />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

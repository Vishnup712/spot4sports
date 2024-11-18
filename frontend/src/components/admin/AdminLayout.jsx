import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import AdminNavbar from './AdminNavbar'

function AdminLayout({ children }) {
  return (
    <Box>
      <AdminNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          mt: 2, // Add margin top for spacing after navbar
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AdminLayout

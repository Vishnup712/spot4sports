import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminLayout from './AdminLayout'

function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" />
  }

  return <AdminLayout>{children}</AdminLayout>
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AdminRoute

import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
}

export default ProtectedRoute

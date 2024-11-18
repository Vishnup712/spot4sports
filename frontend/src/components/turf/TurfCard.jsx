import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PropTypes from 'prop-types'

function TurfCard({ turf }) {
  const navigate = useNavigate()

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => navigate(`/turfs/${turf.id}`)}>
      <CardMedia component="img" height="200" image={turf.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'} alt={turf.name} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {turf.name}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocationOnIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {turf.location}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <AttachMoneyIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {turf.price} per hour
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

TurfCard.propTypes = {
  turf: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
}

export default TurfCard

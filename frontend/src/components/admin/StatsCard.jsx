import PropTypes from 'prop-types'
import { Paper, Typography, Box } from '@mui/material'

function StatsCard({ title, value, icon, color, onClick }) {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%',
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              backgroundColor: `${color}25`,
              boxShadow: `0 4px 12px ${color}15`,
            }
          : {},
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: `${color}25`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: color }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </Box>
    </Paper>
  )
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default StatsCard

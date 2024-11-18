import { useEffect, useState } from 'react'
import { Grid, CircularProgress, Box, Typography } from '@mui/material'
import TurfCard from './TurfCard'
import api from '../../services/api'

function TurfList() {
  const [turfs, setTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await api.get('/turfs')
        setTurfs(response.data)
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch turfs')
        setLoading(false)
      }
    }

    fetchTurfs()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  if (turfs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>No turfs available</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {turfs.map((turf) => (
        <Grid item xs={12} sm={6} md={4} key={turf.id}>
          <TurfCard turf={turf} />
        </Grid>
      ))}
    </Grid>
  )
}

export default TurfList

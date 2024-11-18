import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Grid, Typography, Paper, Box, Slider, FormControl, InputLabel, Select, MenuItem, TextField, Chip, CircularProgress, Button } from '@mui/material'
import TurfCard from '../components/turf/TurfCard'
import api from '../services/api'

function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const initialQuery = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [turfs, setTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    sortBy: 'price_asc',
    facilities: [],
  })
  const [availableFacilities, setAvailableFacilities] = useState([])

  useEffect(() => {
    const newQuery = searchParams.get('q') || ''
    setSearchQuery(newQuery)
  }, [location.search])

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true)
        const response = await api.get('/turfs')
        const allTurfs = response.data

        // Extract unique facilities from all turfs
        const facilities = new Set()
        allTurfs.forEach((turf) => {
          turf.facilities.forEach((facility) => facilities.add(facility))
        })
        setAvailableFacilities(Array.from(facilities))

        // Filter turfs based on search query and filters
        const filteredTurfs = allTurfs.filter((turf) => {
          const matchesSearch = turf.location.toLowerCase().includes(searchQuery.toLowerCase()) || turf.name.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesPrice = turf.price >= filters.priceRange[0] && turf.price <= filters.priceRange[1]
          const matchesFacilities = filters.facilities.length === 0 || filters.facilities.every((f) => turf.facilities.includes(f))
          return matchesSearch && matchesPrice && matchesFacilities
        })

        // Sort turfs
        const sortedTurfs = filteredTurfs.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price_asc':
              return a.price - b.price
            case 'price_desc':
              return b.price - a.price
            default:
              return 0
          }
        })

        setTurfs(sortedTurfs)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching turfs:', error)
        setLoading(false)
      }
    }

    fetchTurfs()
  }, [searchQuery, filters])

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const handleFacilityToggle = (facility) => {
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility) ? prev.facilities.filter((f) => f !== facility) : [...prev.facilities, facility],
    }))
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider value={filters.priceRange} onChange={(_, newValue) => handleFilterChange('priceRange', newValue)} valueLabelDisplay="auto" min={0} max={5000} step={100} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">₹{filters.priceRange[0]}</Typography>
                <Typography variant="body2">₹{filters.priceRange[1]}</Typography>
              </Box>
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={filters.sortBy} label="Sort By" onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography gutterBottom>Facilities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableFacilities.map((facility) => (
                  <Chip key={facility} label={facility} onClick={() => handleFacilityToggle(facility)} color={filters.facilities.includes(facility) ? 'primary' : 'default'} sx={{ m: 0.5 }} />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Search Results
            </Typography>
            <Typography color="text.secondary">
              {turfs.length} {turfs.length === 1 ? 'turf' : 'turfs'} found
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {turfs.map((turf) => (
                <Grid item xs={12} sm={6} md={4} key={turf.id}>
                  <TurfCard turf={turf} />
                </Grid>
              ))}
            </Grid>
          )}

          {!loading && turfs.length === 0 && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No turfs found matching your criteria
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')}>
                View All Turfs
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Search

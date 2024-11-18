import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user || null,
  isLoading: false,
  error: null,
}

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/auth/register', userData)
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', userData)
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer

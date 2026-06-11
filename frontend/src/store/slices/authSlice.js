import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi, registerApi, forgotPasswordApi, verifyOtpApi, resetPasswordApi, googleLoginApi } from '../../services/api'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginApi(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const data = await registerApi(payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    return await forgotPasswordApi(email)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (payload, { rejectWithValue }) => {
  try {
    return await verifyOtpApi(payload)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Verification failed')
  }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    return await resetPasswordApi(payload)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Reset failed')
  }
})

const savedUser = localStorage.getItem('user')
const savedToken = localStorage.getItem('token')

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  loading: false,
  error: null,
  message: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      state.message = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError(state) {
      state.error = null
    },
    setUser(state, action) {
      state.user = action.payload
    },
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null }
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload }
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message || 'Registration successful'
      })
      .addCase(registerUser.rejected, handleRejected)
      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message || 'Reset link sent'
      })
      .addCase(forgotPassword.rejected, handleRejected)
      .addCase(verifyOtp.pending, handlePending)
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message || 'OTP verified'
      })
      .addCase(verifyOtp.rejected, handleRejected)
      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message || 'Password reset successful'
      })
      .addCase(resetPassword.rejected, handleRejected)
  },
})

export const { logout, clearError, setUser, setCredentials } = authSlice.actions
export default authSlice.reducer

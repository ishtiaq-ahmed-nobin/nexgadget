import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { forgotPassword, clearError } from '../../store/slices/authSlice'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const dispatch = useDispatch()
  const { loading, message, error } = useSelector((s) => s.auth)
  const { dark } = useTheme()
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(forgotPassword(email))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Password reset link sent to your email!')
    }
  }

  return (
    <div className={`min-h-[80vh] flex items-center justify-center ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'} py-12`}>
      <div className={`w-full max-w-md p-8 rounded-2xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-xl`}>
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Forgot Password</h1>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Enter your email and we'll send you a reset link</p>
        </div>

        {message ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-green-600 font-medium mb-4">{message}</p>
            <Link to="/login" className="text-[#7c3aed] hover:underline font-medium">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p className="text-center">
              <Link to="/login" className={`text-sm ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>Back to Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

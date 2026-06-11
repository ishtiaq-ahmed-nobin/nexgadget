import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { verifyOtp, clearError } from '../../store/slices/authSlice'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

export default function VerifyOtp() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const { dark } = useTheme()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Please enter complete OTP'); return }
    const email = localStorage.getItem('resetEmail')
    const result = await dispatch(verifyOtp({ email, otp: code }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('OTP verified!')
      navigate('/reset-password')
    }
  }

  return (
    <div className={`min-h-[80vh] flex items-center justify-center ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'} py-12`}>
      <div className={`w-full max-w-md p-8 rounded-2xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-xl`}>
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Verify OTP</h1>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, i) => (
              <input key={i} ref={(el) => (inputRefs.current[i] = el)} type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e.target.value)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-lg border ${
                  dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          <Link to="/forgot-password" className={`${dark ? 'text-gray-400' : 'text-gray-500'} hover:text-[#7c3aed]`}>Resend Code</Link>
        </p>
      </div>
    </div>
  )
}

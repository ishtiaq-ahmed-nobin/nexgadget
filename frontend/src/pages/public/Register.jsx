import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, clearError } from '../../store/slices/authSlice'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const { dark } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Registration successful! Please check your email to verify.')
      navigate('/login')
    }
  }

  return (
    <div className={`min-h-[80vh] flex items-center justify-center ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'} py-12`}>
      <div className={`w-full max-w-md p-8 rounded-2xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-xl`}>
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-[#7c3aed] mb-2">◆</div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Join NexGadget today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
            <input type="password" required minLength={6} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${dark ? 'border-gray-700' : 'border-gray-200'}`}></div></div>
          <div className="relative flex justify-center"><span className={`px-4 text-sm ${dark ? 'bg-[#1e293b] text-gray-400' : 'bg-white text-gray-500'}`}>Or sign up with</span></div>
        </div>

        <button className={`w-full py-2.5 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
          dark ? 'border-gray-700 text-gray-300 hover:bg-[#334155]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign up with Google
        </button>

        <p className={`text-center text-sm mt-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          Already have an account? <Link to="/login" className="text-[#7c3aed] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

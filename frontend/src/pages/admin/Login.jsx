import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { setCredentials } from '../../store/slices/authSlice'
import { loginApi } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import { HiMoon, HiSun } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const token = useSelector((s) => s.auth.token)
  const user = useSelector((s) => s.auth.user)
  if (token && user) return <Navigate to="/admin" replace />

  const [email, setEmail] = useState('admin@nexgadget.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { dark, toggleDark } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await loginApi({ email, password })
      if (data.user?.role !== 'super_admin' && data.user?.role !== 'admin') {
        toast.error('Not authorized as admin')
        setLoading(false)
        return
      }
      dispatch(setCredentials(data))
      toast.success('Welcome back!')
      navigate('/admin')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'} p-4`}>
      <button onClick={toggleDark} className={`absolute top-4 right-4 p-2 rounded-lg ${dark ? 'text-gray-300 hover:bg-[#334155]' : 'text-gray-600 hover:bg-gray-100'}`}>
        {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
      </button>

      <div className={`w-full max-w-md p-8 rounded-2xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-xl`}>
        <div className="text-center mb-8">
          <Link to="/" className="text-[#7c3aed] text-3xl font-bold">◆ NexGadget</Link>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={`mt-6 p-4 rounded-lg text-sm ${dark ? 'bg-[#0f172a] text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          <p className="font-medium mb-2 text-[#7c3aed]">Super Admin Login:</p>
          <p>- Email: <span className="font-mono font-medium">admin@nexgadget.com</span></p>
          <p>- Password: <span className="font-mono font-medium">password</span></p>
        </div>
      </div>
    </div>
  )
}

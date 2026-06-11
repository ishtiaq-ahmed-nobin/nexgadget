import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { useTheme } from '../../context/ThemeContext'
import {
  HiHome, HiCube, HiTag, HiClipboardList, HiShoppingCart, HiUsers,
  HiChartBar, HiCog, HiMenu, HiX, HiMoon, HiSun, HiLogout, HiChevronDown
} from 'react-icons/hi'

const navItems = [
  { to: '/admin', icon: HiHome, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: HiCube, label: 'Products' },
  { to: '/admin/categories', icon: HiTag, label: 'Categories' },
  { to: '/admin/inventory', icon: HiClipboardList, label: 'Inventory' },
  { to: '/admin/orders', icon: HiShoppingCart, label: 'Orders' },
  { to: '/admin/customers', icon: HiUsers, label: 'Customers' },
  { to: '/admin/reports', icon: HiChartBar, label: 'Reports' },
  { to: '/admin/settings', icon: HiCog, label: 'Settings' },
]

export default function AdminLayout() {
  const token = useSelector((s) => s.auth.token)
  if (!token) return <Navigate to="/admin/login" replace />

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((s) => s.auth)
  const { dark, toggleDark } = useTheme()

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to
    return location.pathname.startsWith(item.to)
  }

  return (
    <div className={`min-h-screen flex ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-lg`}>
        <div className="flex items-center justify-between h-16 px-6 border-b dark:border-gray-700">
          <Link to="/admin" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-[#7c3aed]">◆</span>
            <span className={dark ? 'text-white' : 'text-gray-800'}>Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item)
                  ? 'bg-[#7c3aed] text-white'
                  : dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
          <Link to="/" className={`flex items-center gap-2 text-sm ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <HiHome className="w-4 h-4" /> Back to Website
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className={`h-16 flex items-center justify-between px-4 lg:px-8 border-b ${dark ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
              <HiMenu className="w-6 h-6" />
            </button>
            <h2 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>
              {navItems.find((i) => isActive(i))?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${dark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${dark ? 'text-white' : 'text-gray-700'}`}>{user?.name || 'Admin'}</span>
                <HiChevronDown className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-20 ${dark ? 'bg-[#1e293b] border border-gray-700' : 'bg-white border'}`}>
                    <div className={`px-4 py-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <hr className={dark ? 'border-gray-700' : ''} />
                    <button onClick={() => { dispatch(logout()); navigate('/admin/login') }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}>
                      <HiLogout className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

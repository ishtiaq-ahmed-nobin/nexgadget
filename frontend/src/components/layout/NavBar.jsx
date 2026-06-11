import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartCount } from '../../store/slices/cartSlice'
import { logout } from '../../store/slices/authSlice'
import { useTheme } from '../../context/ThemeContext'
import { useCartDrawer } from '../../context/CartDrawerContext'
import { HiMenu, HiX, HiShoppingCart, HiUser, HiMoon, HiSun, HiSearch } from 'react-icons/hi'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartCount = useSelector(selectCartCount)
  const { user } = useSelector((s) => s.auth)
  const { dark, toggleDark } = useTheme()
  const { openCart } = useCartDrawer()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className={`sticky top-0 z-50 ${dark ? 'bg-[#0f172a]' : 'bg-white'} shadow-md transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-[#7c3aed] text-2xl">◆</span>
            <span className={dark ? 'text-white' : 'text-[#2e1c2b]'}>NexGadget</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dark
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-[#2e1c2b] hover:bg-purple-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-lg ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <HiSearch className="w-5 h-5" />
            </button>

            <button
              onClick={toggleDark}
              className={`p-2 rounded-lg ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>

            <button
              onClick={openCart}
              className={`relative p-2 rounded-lg ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <HiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7c3aed] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className={`flex items-center gap-1 p-2 rounded-lg ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <HiUser className="w-5 h-5" />
                </button>
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${dark ? 'bg-[#1e293b]' : 'bg-white'} border ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`px-4 py-2 text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{user.name}</div>
                  <hr className={dark ? 'border-gray-700' : 'border-gray-200'} />
                  {(user.role === 'super_admin' || user.role === 'admin') && (
                    <Link to="/admin" className={`block px-4 py-2 text-sm ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className={`block px-4 py-2 text-sm ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                    My Account
                  </Link>
                  <Link to="/orders" className={`block px-4 py-2 text-sm ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                    My Orders
                  </Link>
                  <hr className={dark ? 'border-gray-700' : 'border-gray-200'} />
                  <button
                    onClick={() => { dispatch(logout()); navigate('/') }}
                    className={`w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors`}
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden p-2 rounded-lg ${dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className={`border-t ${dark ? 'border-gray-700 bg-[#0f172a]' : 'border-gray-200 bg-white'} px-4 py-3`}>
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className={`flex-1 px-4 py-2 rounded-lg border ${
                dark ? 'bg-[#1e293b] border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
              autoFocus
            />
            <button type="submit" className="px-6 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium">
              Search
            </button>
          </form>
        </div>
      )}

      {open && (
        <div className={`md:hidden border-t ${dark ? 'border-gray-700 bg-[#0f172a]' : 'border-gray-200 bg-white'} px-4 py-4`}>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  dark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

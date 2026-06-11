import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'
import { CartDrawerProvider } from '../../context/CartDrawerContext'
import { useTheme } from '../../context/ThemeContext'

export default function Layout() {
  const { dark } = useTheme()

  return (
    <CartDrawerProvider>
      <div className={`min-h-screen flex flex-col ${dark ? 'bg-[#0f172a] text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors`}>
        <NavBar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CartDrawer />
    </CartDrawerProvider>
  )
}

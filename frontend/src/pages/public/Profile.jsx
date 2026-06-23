import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { HiUser, HiMail, HiShieldCheck } from 'react-icons/hi'

export default function Profile() {
  const { user } = useSelector((s) => s.auth)
  const { dark } = useTheme()

  if (!user) {
    return (
      <div className={'min-h-[60vh] flex items-center justify-center ' + (dark ? 'bg-[#0f172a]' : 'bg-gray-50')}>
        <div className="text-center">
          <h2 className={'text-2xl font-bold mb-2 ' + (dark ? 'text-white' : 'text-gray-800')}>Not logged in</h2>
          <p className={'mb-4 ' + (dark ? 'text-gray-400' : 'text-gray-500')}>Please sign in to view your profile.</p>
          <Link to="/login" className="text-[#7c3aed] hover:underline">Sign In</Link>
        </div>
      </div>
    )
  }

  const cardBg = dark ? 'bg-[#1e293b]' : 'bg-white'
  const textWhite = dark ? 'text-white' : 'text-gray-800'
  const textGray = dark ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className={'min-h-screen ' + (dark ? 'bg-[#0f172a]' : 'bg-gray-50')}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className={'text-3xl font-bold mb-8 ' + textWhite}>My Account</h1>

        <div className={'p-6 rounded-xl ' + cardBg + ' shadow-md'}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className={'text-xl font-bold ' + textWhite}>{user.name}</h2>
              <p className={textGray}>{user.role === 'admin' || user.role === 'super_admin' ? 'Admin' : 'Customer'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className={'flex items-center gap-3 p-3 rounded-lg ' + (dark ? 'bg-[#0f172a]' : 'bg-gray-50')}>
              <HiUser className="w-5 h-5 text-[#7c3aed]" />
              <div>
                <p className={'text-sm ' + textGray}>Name</p>
                <p className={'font-medium ' + textWhite}>{user.name}</p>
              </div>
            </div>
            <div className={'flex items-center gap-3 p-3 rounded-lg ' + (dark ? 'bg-[#0f172a]' : 'bg-gray-50')}>
              <HiMail className="w-5 h-5 text-[#7c3aed]" />
              <div>
                <p className={'text-sm ' + textGray}>Email</p>
                <p className={'font-medium ' + textWhite}>{user.email}</p>
              </div>
            </div>
            <div className={'flex items-center gap-3 p-3 rounded-lg ' + (dark ? 'bg-[#0f172a]' : 'bg-gray-50')}>
              <HiShieldCheck className="w-5 h-5 text-[#7c3aed]" />
              <div>
                <p className={'text-sm ' + textGray}>Role</p>
                <p className={'font-medium ' + textWhite}>{user.role || 'customer'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link to="/orders"
              className="flex-1 text-center py-2.5 bg-[#7c3aed] text-white rounded-lg font-medium hover:bg-[#6d28d9] transition-colors">
              My Orders
            </Link>
            <Link to="/shop"
              className={'flex-1 text-center py-2.5 rounded-lg font-medium border transition-colors ' + (dark ? 'border-gray-700 text-gray-300 hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:bg-gray-100')}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

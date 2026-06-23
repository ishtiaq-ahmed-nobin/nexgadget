import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { fetchMyOrdersApi } from '../../services/api'

const statusColors = {
  Completed: 'text-green-600 bg-green-100',
  Processing: 'text-blue-600 bg-blue-100',
  Shipped: 'text-purple-600 bg-purple-100',
  Pending: 'text-yellow-600 bg-yellow-100',
  Cancelled: 'text-red-600 bg-red-100',
}

export default function Orders() {
  const { user } = useSelector((s) => s.auth)
  const { dark } = useTheme()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadOrders()
  }, [user])

  const loadOrders = async () => {
    try {
      const data = await fetchMyOrdersApi()
      setOrders(data.orders || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className={'min-h-[60vh] flex items-center justify-center ' + (dark ? 'bg-[#0f172a]' : 'bg-gray-50')}>
        <div className="text-center">
          <h2 className={'text-2xl font-bold mb-2 ' + (dark ? 'text-white' : 'text-gray-800')}>Not logged in</h2>
          <p className={'mb-4 ' + (dark ? 'text-gray-400' : 'text-gray-500')}>Please sign in to view your orders.</p>
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className={'text-3xl font-bold mb-8 ' + textWhite}>My Orders</h1>

        {loading ? (
          <p className={'text-center py-8 ' + textGray}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className={'p-8 rounded-xl text-center ' + cardBg + ' shadow-md'}>
            <p className={'text-lg mb-4 ' + textGray}>No orders yet</p>
            <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#7c3aed] text-white rounded-lg font-medium hover:bg-[#6d28d9] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className={'p-5 rounded-xl ' + cardBg + ' shadow-md'}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className={'text-sm ' + textGray}>Order</p>
                    <p className={'font-mono font-medium ' + textWhite}>{order.id}</p>
                  </div>
                  <span className={'px-3 py-1 rounded text-xs font-medium ' + (statusColors[order.status] || 'text-gray-600 bg-gray-100')}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {Array.isArray(order.items) && order.items.map((item, idx) => (
                    <div key={idx} className={'flex items-center justify-between text-sm ' + textGray}>
                      <span>{item.name || 'Product'} x {item.quantity || 1}</span>
                      <span className={'font-medium ' + textWhite}>Tk {Number(item.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                  {!Array.isArray(order.items) && (
                    <p className={'text-sm ' + textGray}>{order.items_count || order.items || 0} item(s)</p>
                  )}
                </div>

                <hr className={dark ? 'border-gray-700' : 'border-gray-200'} />
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                  <div className="flex gap-4 text-sm">
                    <span className={textGray}>Total: <span className={'font-bold ' + textWhite}>Tk {Number(order.total).toFixed(2)}</span></span>
                    <span className={textGray}>Payment: <span className={'font-medium ' + (order.payment === 'Paid' ? 'text-green-500' : 'text-yellow-500')}>{order.payment}</span></span>
                  </div>
                  <span className={'text-xs ' + textGray}>{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchDashboardStatsApi, fetchDashboardChartsApi } from '../../services/api'
import { HiTrendingUp, HiCube, HiShoppingCart, HiUsers } from 'react-icons/hi'

const statusColors = {
  Completed: 'text-green-600 bg-green-100',
  Processing: 'text-blue-600 bg-blue-100',
  Shipped: 'text-purple-600 bg-purple-100',
  Pending: 'text-yellow-600 bg-yellow-100',
}

export default function AdminDashboard() {
  const { dark } = useTheme()
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    fetchDashboardStatsApi().then(setStats).catch(() => {})
    fetchDashboardChartsApi().then((data) => setRecentOrders(data.recentOrders || [])).catch(() => {})
  }, [])

  const statsCards = [
    { label: 'Total Revenue', value: stats ? `৳${(stats.revenue || 0).toLocaleString()}` : '—', icon: HiTrendingUp, color: 'bg-green-500' },
    { label: 'Total Products', value: stats?.products ?? '—', icon: HiCube, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats?.orders ?? '—', icon: HiShoppingCart, color: 'bg-purple-500' },
    { label: 'Total Customers', value: stats?.customers ?? '—', icon: HiUsers, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, i) => (
          <div key={i} className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${card.color} bg-opacity-10 flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
        <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left py-3 px-2 font-medium">Order</th>
                <th className="text-left py-3 px-2 font-medium">Customer</th>
                <th className="text-left py-3 px-2 font-medium">Amount</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
                <th className="text-left py-3 px-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={i} className={`border-b ${dark ? 'border-gray-700' : 'border-gray-100'} hover:bg-gray-50 dark:hover:bg-white/5`}>
                  <td className="py-3 px-2 font-medium">{order.id}</td>
                  <td className="py-3 px-2">{order.customer}</td>
                  <td className="py-3 px-2">{order.amount}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.status] || 'text-gray-600 bg-gray-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={`py-3 px-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{order.date}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

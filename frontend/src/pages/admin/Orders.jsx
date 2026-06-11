import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchOrdersApi, updateOrderStatusApi } from '../../services/api'
import toast from 'react-hot-toast'

const statusColors = {
  Completed: 'text-green-600 bg-green-100',
  Processing: 'text-blue-600 bg-blue-100',
  Shipped: 'text-purple-600 bg-purple-100',
  Pending: 'text-yellow-600 bg-yellow-100',
  Cancelled: 'text-red-600 bg-red-100',
}

export default function AdminOrders() {
  const { dark } = useTheme()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try {
      const data = await fetchOrdersApi({ per_page: 100 })
      setOrders(data.orders || [])
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(true)
    try {
      await updateOrderStatusApi(id, newStatus)
      toast.success(`Order ${id} updated to ${newStatus}`)
      setSelectedOrder(null)
      loadOrders()
    } catch { toast.error('Failed to update order') }
    finally { setUpdating(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? 'bg-[#7c3aed] text-white' : dark ? 'bg-[#0f172a] text-gray-300 hover:bg-[#334155]' : 'bg-white text-gray-600 hover:bg-gray-100'
            } border ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className={`overflow-x-auto rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="text-left py-4 px-4 font-medium">Order</th>
              <th className="text-left py-4 px-4 font-medium">Customer</th>
              <th className="text-left py-4 px-4 font-medium">Items</th>
              <th className="text-left py-4 px-4 font-medium">Total</th>
              <th className="text-left py-4 px-4 font-medium">Payment</th>
              <th className="text-left py-4 px-4 font-medium">Status</th>
              <th className="text-left py-4 px-4 font-medium">Date</th>
              <th className="text-right py-4 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-8 text-center text-gray-400">No orders found</td></tr>
            ) : filtered.map((order) => (
              <tr key={order.id} className={`border-b ${dark ? 'border-gray-700' : 'border-gray-100'} hover:bg-gray-50 dark:hover:bg-white/5`}>
                <td className={`py-4 px-4 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{order.id}</td>
                <td>
                  <div className={`py-4 px-4 ${dark ? 'text-white' : 'text-gray-800'}`}>{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td className="py-4 px-4">{order.items}</td>
                <td className={`py-4 px-4 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>৳{Number(order.total).toFixed(2)}</td>
                <td className="py-4 px-4">
                  <span className={`text-xs ${order.payment === 'Paid' ? 'text-green-500' : order.payment === 'Refunded' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.status] || 'text-gray-600 bg-gray-100'}`}>{order.status}</span>
                </td>
                <td className={`py-4 px-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{order.date}</td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className={`px-3 py-1 text-xs rounded-lg ${dark ? 'bg-[#334155] text-gray-300' : 'bg-gray-100 text-gray-700'} hover:bg-[#7c3aed] hover:text-white transition-colors`}>
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
          <h3 className={`font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>
            Manage Order {selectedOrder.id}
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map((s) => (
              <button key={s} onClick={() => handleStatusChange(selectedOrder.id, s)} disabled={updating}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  selectedOrder.status === s ? 'bg-[#7c3aed] text-white' : dark ? 'bg-[#0f172a] text-gray-300' : 'bg-gray-100 text-gray-700'
                } hover:bg-[#7c3aed] hover:text-white`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

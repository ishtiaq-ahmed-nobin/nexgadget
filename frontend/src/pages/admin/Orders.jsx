import { Fragment, useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchOrdersApi, updateOrderPaymentApi, updateOrderStatusApi } from '../../services/api'
import toast from 'react-hot-toast'

const statuses = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']
const paymentStatuses = ['Pending', 'Paid', 'Refunded', 'Failed']

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
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  const handleStatusChange = async (id, newStatus) => {
    const order = orders.find((item) => item.id === id)
    if (order?.status === newStatus) return

    setUpdating(true)
    try {
      await updateOrderStatusApi(id, newStatus)
      toast.success(`Order ${id} updated to ${newStatus}`)
      setOrders((current) => current.map((item) => (
        item.id === id ? { ...item, status: newStatus } : item
      )))
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  const handlePaymentChange = async (id, newPayment) => {
    const order = orders.find((item) => item.id === id)
    if (order?.payment === newPayment) return

    setUpdating(true)
    try {
      await updateOrderPaymentApi(id, newPayment)
      toast.success(`Order ${id} payment updated to ${newPayment}`)
      setOrders((current) => current.map((item) => (
        item.id === id ? { ...item, payment: newPayment } : item
      )))
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, payment: newPayment })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update payment')
    } finally {
      setUpdating(false)
    }
  }

  const parseItems = (items) => {
    if (Array.isArray(items)) return items
    if (typeof items !== 'string') return []
    try {
      const parsed = JSON.parse(items)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['All', ...statuses].map((s) => (
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
              <Fragment key={order.id}>
                <tr className={`border-b ${dark ? 'border-gray-700' : 'border-gray-100'} hover:bg-gray-50 dark:hover:bg-white/5`}>
                  <td className={`py-4 px-4 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{order.id}</td>
                  <td>
                    <div className={`py-4 px-4 ${dark ? 'text-white' : 'text-gray-800'}`}>{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </td>
                  <td className="py-4 px-4">{order.items}</td>
                  <td className={`py-4 px-4 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>Tk {Number(order.total).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs ${order.payment === 'Paid' ? 'text-green-500' : order.payment === 'Refunded' ? 'text-red-500' : 'text-yellow-500'}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.status] || 'text-gray-600 bg-gray-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={`py-4 px-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{order.date}</td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className={`px-3 py-1 text-xs rounded-lg ${dark ? 'bg-[#334155] text-gray-300' : 'bg-gray-100 text-gray-700'} hover:bg-[#7c3aed] hover:text-white transition-colors`}>
                      Manage
                    </button>
                  </td>
                </tr>

                {selectedOrder?.id === order.id && (
                  <tr className={`border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td colSpan={8} className={`px-4 py-5 ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                      <div className={`rounded-xl p-5 ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-sm`}>
                        <h3 className={`font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>
                          Manage Order {order.id}
                        </h3>
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <p><span className="font-medium">Customer:</span> {order.customer}</p>
                          <p><span className="font-medium">Email:</span> {order.email}</p>
                          <p><span className="font-medium">Phone:</span> {order.customer_phone || 'N/A'}</p>
                          <p className="md:col-span-2"><span className="font-medium">Shipping:</span> {order.shipping_address || 'N/A'}</p>
                          <p><span className="font-medium">Date:</span> {order.date}</p>
                        </div>

                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4`}>
                          <div className={`rounded-lg border p-4 ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h4 className={`font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-800'}`}>Items</h4>
                            <div className="space-y-2">
                              {parseItems(order.items_raw || order.items_json || order.items_data || order.items_detail || order.items_text || order.items).map((item, index) => (
                                <div key={`${item.name}-${index}`} className={`flex items-center justify-between text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                  <span>{item.name || 'Product'} x {item.quantity || 1}</span>
                                  <span>Tk {Number(item.price || 0).toFixed(2)}</span>
                                </div>
                              ))}
                              {parseItems(order.items_raw || order.items_json || order.items_data || order.items_detail || order.items_text || order.items).length === 0 && (
                                <p className="text-sm text-gray-400">{order.items_count || order.items || 0} item(s)</p>
                              )}
                            </div>
                          </div>

                          <div className={`rounded-lg border p-4 ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h4 className={`font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-800'}`}>Totals</h4>
                            {[
                              ['Subtotal', order.subtotal],
                              ['Shipping', order.shipping],
                              ['Tax', order.tax],
                              ['Total', order.total],
                            ].map(([label, value]) => (
                              <div key={label} className={`flex items-center justify-between text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <span>{label}</span>
                                <span className={label === 'Total' ? 'font-semibold' : ''}>Tk {Number(value || 0).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h4 className={`font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>Order Status</h4>
                            <div className="flex flex-wrap gap-2">
                              {statuses.map((s) => (
                                <button key={s} onClick={() => handleStatusChange(order.id, s)} disabled={updating}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                                    order.status === s ? 'bg-[#7c3aed] text-white' : dark ? 'bg-[#0f172a] text-gray-300' : 'bg-gray-100 text-gray-700'
                                  } hover:bg-[#7c3aed] hover:text-white`}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className={`font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>Payment Status</h4>
                            <div className="flex flex-wrap gap-2">
                              {paymentStatuses.map((p) => (
                                <button key={p} onClick={() => handlePaymentChange(order.id, p)} disabled={updating}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                                    order.payment === p ? 'bg-[#7c3aed] text-white' : dark ? 'bg-[#0f172a] text-gray-300' : 'bg-gray-100 text-gray-700'
                                  } hover:bg-[#7c3aed] hover:text-white`}>
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

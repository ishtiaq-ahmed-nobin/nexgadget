import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchReportsApi } from '../../services/api'
import { HiDownload } from 'react-icons/hi'
import toast from 'react-hot-toast'

const reportTypes = [
  { id: 'sales', label: 'Sales Report', desc: 'Daily, weekly, monthly and yearly sales data' },
  { id: 'profit', label: 'Profit & Loss', desc: 'Revenue analysis and profit calculations' },
  { id: 'inventory', label: 'Inventory Report', desc: 'Current stock, stock value, low stock items' },
  { id: 'customer', label: 'Customer Report', desc: 'Customer registrations and purchase history' },
]

export default function AdminReports() {
  const { dark } = useTheme()
  const [period, setPeriod] = useState('monthly')
  const [selected, setSelected] = useState('sales')
  const [summary, setSummary] = useState({
    revenue: 0,
    orders: 0,
    productCategories: 0,
    profit: 0,
  })

  useEffect(() => {
    Promise.all([
      fetchReportsApi('revenue'),
      fetchReportsApi('orders'),
      fetchReportsApi('products'),
    ]).then(([revenue, orders, products]) => {
      const totalRevenue = Number(revenue.total || 0)
      setSummary({
        revenue: totalRevenue,
        orders: orders.reduce?.((sum, item) => sum + Number(item.count || 0), 0) || 0,
        productCategories: products.length || 0,
        profit: totalRevenue * 0.25,
      })
    }).catch(() => {})
  }, [])

  const handleExport = (format) => {
    toast.success(`Exporting ${selected} report as ${format.toUpperCase()}`)
  }

  const currentReport = reportTypes.find((r) => r.id === selected)
  const money = (value) => `৳${Number(value || 0).toLocaleString()}`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {reportTypes.map((r) => (
          <button key={r.id} onClick={() => setSelected(r.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selected === r.id ? 'bg-[#7c3aed] text-white shadow-md' : dark ? 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]' : 'bg-white text-gray-700 hover:bg-gray-100'
            } border ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
            {r.label}
          </button>
        ))}
      </div>

      <div className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{currentReport?.label}</h3>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{currentReport?.desc}</p>
          </div>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7c3aed]`}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className={`h-64 rounded-xl ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'} flex items-center justify-center mb-6`}>
          <p className="text-gray-400">{currentReport?.label} - {period}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`text-sm font-medium self-center mr-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Export:</span>
          {['PDF', 'Excel', 'CSV'].map((fmt) => (
            <button key={fmt} onClick={() => handleExport(fmt)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#7c3aed] text-white rounded-lg text-sm hover:bg-[#6d28d9] transition-colors">
              <HiDownload className="w-4 h-4" /> {fmt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: money(summary.revenue), change: `${summary.orders} orders` },
          { label: 'Estimated Profit', value: money(summary.profit), change: '25% margin' },
          { label: 'Product Groups', value: summary.productCategories, change: 'active categories' },
          { label: 'Profit Margin', value: '25.0%', change: 'demo estimate' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            <p className="text-xs text-green-500">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

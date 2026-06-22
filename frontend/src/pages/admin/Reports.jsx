import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchReportsApi } from '../../services/api'
import { HiDownload } from 'react-icons/hi'
import toast from 'react-hot-toast'

const reportTypes = [
  { id: 'revenue', label: 'Revenue Report', desc: 'Revenue totals and recent order trend' },
  { id: 'orders', label: 'Orders Report', desc: 'Order count grouped by status' },
  { id: 'products', label: 'Products Report', desc: 'Product count grouped by category' },
]

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCsv(value) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

export default function AdminReports() {
  const { dark } = useTheme()
  const today = new Date().toISOString().slice(0, 10)
  const thirtyDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const [filters, setFilters] = useState({ from: thirtyDaysAgo, to: today })
  const [selected, setSelected] = useState('revenue')
  const [reportData, setReportData] = useState({ revenue: null, orders: [], products: [] })
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState({
    revenue: 0,
    orders: 0,
    productCategories: 0,
    profit: 0,
  })

  const loadReports = () => {
    if (filters.from && filters.to && filters.from > filters.to) {
      toast.error('From date cannot be after To date')
      return
    }

    setLoading(true)
    const params = { from: filters.from, to: filters.to }
    Promise.all([
      fetchReportsApi('revenue', params),
      fetchReportsApi('orders', params),
      fetchReportsApi('products', params),
    ]).then(([revenue, orders, products]) => {
      const totalRevenue = Number(revenue.total || 0)
      setReportData({ revenue, orders, products })
      setSummary({
        revenue: totalRevenue,
        orders: orders.reduce((sum, item) => sum + Number(item.count || 0), 0),
        productCategories: products.length,
        profit: totalRevenue * 0.25,
      })
    }).catch((err) => {
      toast.error(err.response?.data?.error || 'Reports could not be loaded')
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReports()
  }, [])

  const getExportRows = () => {
    if (selected === 'revenue') {
      return [
        ['Metric', 'Value'],
        ['Total Revenue', money(selectedData?.total)],
        ['Paid Orders', selectedData?.count || 0],
        [],
        ['Date', 'Revenue'],
        ...(selectedData?.trend || []).map((item) => [item.date, money(item.revenue)]),
      ]
    }

    return [
      [selected === 'orders' ? 'Status' : 'Category', 'Count'],
      ...(selectedData || []).map((item) => [item.status || item.category, item.count]),
    ]
  }

  const handleExport = (format) => {
    if (loading) {
      toast.error('Report is still loading')
      return
    }

    const rows = getExportRows()
    if (rows.length <= 1) {
      toast.error('No report data to export')
      return
    }

    const range = `${filters.from || 'start'}-to-${filters.to || 'today'}`
    const filename = `${selected}-report-${range}`
    const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n')

    if (format === 'CSV') {
      downloadFile(`${filename}.csv`, csv, 'text/csv;charset=utf-8')
      toast.success('CSV report downloaded')
      return
    }

    if (format === 'Excel') {
      const tableRows = rows.map((row) => (
        `<tr>${row.map((cell) => `<td>${String(cell ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</td>`).join('')}</tr>`
      )).join('')
      const html = `<table>${tableRows}</table>`
      downloadFile(`${filename}.xls`, html, 'application/vnd.ms-excel;charset=utf-8')
      toast.success('Excel report downloaded')
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Allow popups to export PDF')
      return
    }
    const tableRows = rows.map((row) => (
      `<tr>${row.map((cell) => `<td>${String(cell ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</td>`).join('')}</tr>`
    )).join('')
    printWindow.document.write(`
      <html>
        <head>
          <title>${currentReport?.label}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 22px; margin-bottom: 6px; }
            p { color: #555; margin-top: 0; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            td { border: 1px solid #ddd; padding: 8px; }
            tr:first-child td { font-weight: bold; background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>${currentReport?.label}</h1>
          <p>Date range: ${filters.from || 'Start'} to ${filters.to || 'Today'}</p>
          <table>${tableRows}</table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const currentReport = reportTypes.find((r) => r.id === selected)
  const selectedData = reportData[selected]
  const money = (value) => `Tk ${Number(value || 0).toLocaleString()}`

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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{currentReport?.label}</h3>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{currentReport?.desc}</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              From
              <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className={`block mt-1 px-3 py-1.5 rounded-lg border text-sm ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7c3aed]`} />
            </label>
            <label className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              To
              <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className={`block mt-1 px-3 py-1.5 rounded-lg border text-sm ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#7c3aed]`} />
            </label>
            <button type="button" onClick={loadReports} disabled={loading}
              className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg text-sm font-medium hover:bg-[#6d28d9] transition-colors disabled:opacity-50">
              Apply
            </button>
          </div>
        </div>

        <div className={`min-h-64 rounded-xl ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'} mb-6 p-4`}>
          {loading ? (
            <p className="text-gray-400">Loading report...</p>
          ) : selected === 'revenue' ? (
            <div className="space-y-3">
              <div className={`rounded-lg p-4 ${dark ? 'bg-[#1e293b]' : 'bg-white'}`}>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</p>
                <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{money(selectedData?.total)}</p>
                <p className="text-sm text-green-500">{selectedData?.count || 0} paid orders</p>
              </div>
              {(selectedData?.trend || []).map((item) => (
                <div key={item.date} className={`flex items-center justify-between rounded-lg px-4 py-2 ${dark ? 'bg-[#1e293b] text-gray-200' : 'bg-white text-gray-700'}`}>
                  <span>{item.date}</span>
                  <span className="font-semibold">{money(item.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(selectedData || []).map((item) => {
                const label = item.status || item.category
                return (
                  <div key={label} className={`flex items-center justify-between rounded-lg px-4 py-3 ${dark ? 'bg-[#1e293b] text-gray-200' : 'bg-white text-gray-700'}`}>
                    <span>{label}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                )
              })}
              {!selectedData?.length && <p className="text-gray-400">No report data found.</p>}
            </div>
          )}
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

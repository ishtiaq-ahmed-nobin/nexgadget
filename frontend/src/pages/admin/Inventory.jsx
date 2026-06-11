import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchInventoryApi, updateStockApi } from '../../services/api'
import { HiSearch } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function AdminInventory() {
  const { dark } = useTheme()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => { loadInventory() }, [])

  const loadInventory = async () => {
    try {
      const data = await fetchInventoryApi()
      setItems(data.inventory || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }

  const filtered = items.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  const totalValue = filtered.reduce((s, p) => s + Number(p.value || p.stock * p.price || 0), 0)

  const handleUpdateStock = async (id) => {
    const qty = prompt('Enter new stock quantity:')
    if (qty === null || isNaN(qty)) return
    setUpdating(id)
    try {
      await updateStockApi(id, parseInt(qty))
      toast.success(`Stock updated for item #${id}`)
      loadInventory()
    } catch { toast.error('Failed to update stock') }
    finally { setUpdating(null) }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Items', value: items.length },
          { label: 'Low Stock Items', value: items.filter((i) => i.stock <= (i.min_stock || i.minStock || 0)).length, color: 'text-red-500' },
          { label: 'Stock Value', value: `৳${totalValue.toLocaleString()}`, color: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color || (dark ? 'text-white' : 'text-gray-900')}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
      </div>

      <div className={`overflow-x-auto rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="text-left py-4 px-4 font-medium">Product</th>
              <th className="text-left py-4 px-4 font-medium">SKU</th>
              <th className="text-left py-4 px-4 font-medium">Stock</th>
              <th className="text-left py-4 px-4 font-medium">Min Stock</th>
              <th className="text-left py-4 px-4 font-medium">Price</th>
              <th className="text-left py-4 px-4 font-medium">Stock Value</th>
              <th className="text-right py-4 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-gray-400">No items found</td></tr>
            ) : filtered.map((item) => {
              const minStock = item.min_stock || item.minStock || 0
              const stock = item.stock || 0
              const price = item.price || 0
              const stockValue = item.value || stock * price
              const lowStock = stock <= minStock && stock > 0
              const outOfStock = stock === 0
              return (
                <tr key={item.id} className={`border-b ${dark ? 'border-gray-700' : 'border-gray-100'} hover:bg-gray-50 dark:hover:bg-white/5 ${
                  outOfStock ? 'bg-red-50 dark:bg-red-900/10' : lowStock ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                }`}>
                  <td className={`py-4 px-4 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{item.name}</td>
                  <td className={`py-4 px-4 ${dark ? 'text-gray-400' : 'text-gray-500'} font-mono text-xs`}>{item.sku}</td>
                  <td className={`py-4 px-4 font-bold ${outOfStock ? 'text-red-500' : lowStock ? 'text-yellow-500' : ''}`}>{stock}</td>
                  <td className="py-4 px-4">{minStock}</td>
                  <td className="py-4 px-4">৳{price}</td>
                  <td className="py-4 px-4">৳{Number(stockValue).toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => handleUpdateStock(item.id)} disabled={updating === item.id}
                      className="px-3 py-1 text-xs bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] disabled:opacity-50">
                      {updating === item.id ? '...' : 'Update'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

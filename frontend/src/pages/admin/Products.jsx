import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { fetchProductsApi, deleteProductApi } from '../../services/api'
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const { dark } = useTheme()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [imgVer] = useState(Date.now)

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      const data = await fetchProductsApi({ per_page: 100 })
      if (data.products?.length) {
        setProducts(data.products)
      } else {
        setProducts([])
      }
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProductApi(id)
      toast.success('Product deleted')
      loadProducts()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
        </div>
        <Link to="/admin/products/add" className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
          <HiPlus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className={`overflow-x-auto rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="text-left py-4 px-4 font-medium">Product</th>
              <th className="text-left py-4 px-4 font-medium">Category</th>
              <th className="text-left py-4 px-4 font-medium">Price</th>
              <th className="text-left py-4 px-4 font-medium">Stock</th>
              <th className="text-left py-4 px-4 font-medium">Status</th>
              <th className="text-right py-4 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">No products found</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className={`border-b ${dark ? 'border-gray-700' : 'border-gray-100'} hover:bg-gray-50 dark:hover:bg-white/5`}>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${dark ? 'bg-[#0f172a]' : 'bg-gray-100'} flex items-center justify-center text-xs text-gray-400 overflow-hidden`}>
                      {p.image ? <img src={`${p.image}${p.image.includes('?') ? '&' : '?'}_v=${imgVer}`} alt="" className="w-full h-full object-cover" /> : p.name?.charAt(0)}
                    </div>
                    <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{p.name}</span>
                  </div>
                </td>
                <td className={`py-4 px-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{p.category}</td>
                <td className={`py-4 px-4 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>৳{p.price}</td>
                <td className="py-4 px-4">
                  <span className={`${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-yellow-500' : ''}`}>{p.stock}</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === 'Active' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                    {p.status || 'Active'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/products/edit/${p.id}`} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                      <HiPencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-red-400' : 'hover:bg-gray-100 text-red-500'}`}>
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

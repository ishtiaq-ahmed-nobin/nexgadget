import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { fetchProductByIdApi, updateProductApi } from '../../services/api'
import toast from 'react-hot-toast'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dark } = useTheme()
  const [form, setForm] = useState({
    name: '', category: '', price: '', discount_price: '', stock: '', description: '', short_description: '', status: 'Active',
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [currentImage, setCurrentImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductByIdApi(id).then((p) => {
      if (p) {
        setForm({
          name: p.name || '',
          category: p.category || '',
          price: p.price?.toString() || '',
          discount_price: p.discount_price?.toString() || '',
          stock: p.stock?.toString() || '0',
          description: p.description || '',
          short_description: p.short_description || '',
          status: p.status || 'Active',
        })
        if (p.image) setCurrentImage(p.image)
      }
    }).catch(() => toast.error('Failed to load product'))
    .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (preview) URL.revokeObjectURL(preview)
    setImage(file)
    setPreview(file ? URL.createObjectURL(file) : '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)
      await updateProductApi(id, fd)
      toast.success('Product updated successfully!')
      navigate('/admin/products')
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to update product'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>

  return (
    <div className={`max-w-3xl p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
      <h2 className={`text-xl font-bold mb-6 ${dark ? 'text-white' : 'text-gray-800'}`}>Edit Product #{id}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Product Name *</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}>
              <option value="Smartphones">Smartphones</option>
              <option value="Laptops">Laptops</option>
              <option value="Tablets">Tablets</option>
              <option value="Smart Watches">Smart Watches</option>
              <option value="Headphones">Headphones</option>
              <option value="Gaming Accessories">Gaming Accessories</option>
              <option value="Computer Components">Computer Components</option>
              <option value="Cameras">Cameras</option>
              <option value="Networking Devices">Networking Devices</option>
              <option value="Smart Home Devices">Smart Home Devices</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Price *</label>
            <input type="number" name="price" required min={0} step="0.01" value={form.price} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Discount Price</label>
            <input type="number" name="discount_price" min={0} step="0.01" value={form.discount_price} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Stock Quantity *</label>
            <input type="number" name="stock" required min={0} value={form.stock} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Short Description</label>
            <input type="text" name="short_description" value={form.short_description} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Product Image</label>
            <div className="flex items-center gap-4">
              {currentImage && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border dark:border-gray-700 flex-shrink-0">
                  <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#7c3aed] file:text-white file:text-sm`} />
                {preview && (
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border dark:border-gray-700">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Update Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')}
            className={`px-6 py-2.5 rounded-lg border font-medium ${dark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

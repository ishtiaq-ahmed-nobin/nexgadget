import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { createProductApi } from '../../services/api'
import toast from 'react-hot-toast'

export default function AddProduct() {
  const navigate = useNavigate()
  const { dark } = useTheme()
  const [form, setForm] = useState({
    name: '', category: '', price: '', discount_price: '', stock: '', description: '', short_description: '', status: 'Active',
  })
  const [image, setImage] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)
      await createProductApi(fd)
      toast.success('Product created successfully!')
      navigate('/admin/products')
    } catch {
      toast.error('Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`max-w-3xl p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
      <h2 className={`text-xl font-bold mb-6 ${dark ? 'text-white' : 'text-gray-800'}`}>Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Product Name *</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
            <select name="category" required value={form.category} onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}>
              <option value="">Select category</option>
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
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
              className={`w-full px-4 py-2.5 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#7c3aed] file:text-white file:text-sm`} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Create Product'}
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

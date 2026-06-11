import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '../../services/api'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const { dark } = useTheme()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategoriesApi()
      setCategories(Array.isArray(data) ? data : data.categories || [])
    } catch { setCategories([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadCategories() }, [loadCategories])

  const openAdd = () => { setEditing(null); setName(''); setShowModal(true) }
  const openEdit = (cat) => { setEditing(cat); setName(cat.name); setShowModal(true) }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateCategoryApi(editing.id, { name })
        toast.success('Category updated!')
      } else {
        await createCategoryApi({ name })
        toast.success('Category created!')
      }
      setShowModal(false)
      loadCategories()
    } catch { toast.error('Failed to save category') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategoryApi(id)
      toast.success('Category deleted')
      loadCategories()
    } catch { toast.error('Failed to delete category') }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{categories.length} categories</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
          <HiPlus className="w-5 h-5" /> Add Category
        </button>
      </div>

      <div className={`overflow-x-auto rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="text-left py-4 px-4 font-medium">Name</th>
              <th className="text-left py-4 px-4 font-medium">Slug</th>
              <th className="text-left py-4 px-4 font-medium">Products</th>
              <th className="text-right py-4 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No categories yet</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className={`border-b ${dark ? 'border-gray-700' : 'border-gray-100'} hover:bg-gray-50 dark:hover:bg-white/5`}>
                <td className={`py-4 px-4 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{cat.name}</td>
                <td className={`py-4 px-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{cat.slug}</td>
                <td className="py-4 px-4">{cat.product_count ?? cat.products ?? 0}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(cat)} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                      <HiPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-red-400' : 'hover:bg-gray-100 text-red-500'}`}>
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-xl`}>
            <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>
              {editing ? 'Edit Category' : 'Add Category'}
            </h3>
            <input type="text" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} autoFocus
              className={`w-full px-4 py-2.5 rounded-lg border mb-4 ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-lg border text-sm font-medium ${dark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg text-sm font-medium hover:bg-[#6d28d9] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

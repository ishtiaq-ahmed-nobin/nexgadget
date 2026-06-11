import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchCustomersApi } from '../../services/api'
import { HiSearch, HiMail } from 'react-icons/hi'

export default function AdminCustomers() {
  const { dark } = useTheme()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchCustomersApi({ per_page: 100 }).then((data) => {
      setCustomers(data.customers || [])
    }).catch(() => setCustomers([]))
    .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
        </div>

        <div className={`overflow-x-auto rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left py-4 px-4 font-medium">Customer</th>
                <th className="text-left py-4 px-4 font-medium">Orders</th>
                <th className="text-left py-4 px-4 font-medium">Spent</th>
                <th className="text-left py-4 px-4 font-medium">Status</th>
                <th className="text-right py-4 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No customers found</td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className={`border-b ${dark ? 'border-gray-700' : 'border-gray-100'} cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5`}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-sm font-bold">
                        {c.name?.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{c.name}</div>
                        <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{c.orders}</td>
                  <td className={`py-4 px-4 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>৳{Number(c.spent).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === 'Active' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className={`p-2 rounded-lg ${dark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                      <HiMail className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md h-fit`}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {selected.name?.charAt(0)}
            </div>
            <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{selected.name}</h3>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{selected.email}</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Phone</span>
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{selected.phone || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Total Orders</span>
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{selected.orders}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Total Spent</span>
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>৳{Number(selected.spent).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Member Since</span>
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{selected.joined || selected.created_at?.split('T')[0]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

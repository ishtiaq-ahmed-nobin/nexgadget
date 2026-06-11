import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { fetchSettingsApi, updateSettingsApi } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { dark } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const [general, setGeneral] = useState({
    site_name: 'NexGadget',
    site_email: 'support@nexgadget.com',
    site_phone: '+1 (555) 123-4567',
    address: '123 Gadget Street, Tech City',
    currency: 'BDT',
    tax_rate: '8',
    shipping_fee: '5.99',
    free_shipping_threshold: '50',
  })

  const [payment, setPayment] = useState({
    bkash: true,
    nagad: true,
    sslcommerz: true,
    visa: true,
    mastercard: true,
    amex: true,
    live_mode: false,
  })

  const [email, setEmail] = useState({
    smtp_host: 'smtp.example.com',
    smtp_port: '587',
    smtp_user: 'noreply@nexgadget.com',
    smtp_pass: '',
    from_name: 'NexGadget',
    from_email: 'noreply@nexgadget.com',
  })

  useEffect(() => {
    fetchSettingsApi().then((data) => {
      if (data.settings) {
        const map = {}
        data.settings.forEach((s) => { map[s.key] = s.value })
        if (map.site_name) setGeneral((prev) => ({ ...prev, ...map }))
      }
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const settings = { ...general, ...payment, ...email }
      await updateSettingsApi({ settings })
      toast.success('Settings saved successfully!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'payment', label: 'Payment' },
    { id: 'email', label: 'Email' },
  ]

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.id ? 'bg-[#7c3aed] text-white' : dark ? 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]' : 'bg-white text-gray-700 hover:bg-gray-100'
            } border ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>General Settings</h3>
            </div>
            {[
              { key: 'site_name', label: 'Site Name', type: 'text' },
              { key: 'site_email', label: 'Site Email', type: 'email' },
              { key: 'site_phone', label: 'Site Phone', type: 'text' },
              { key: 'address', label: 'Address', type: 'text' },
              { key: 'currency', label: 'Currency', type: 'text' },
              { key: 'tax_rate', label: 'Tax Rate (%)', type: 'number' },
              { key: 'shipping_fee', label: 'Shipping Fee', type: 'number' },
              { key: 'free_shipping_threshold', label: 'Free Shipping Threshold', type: 'number' },
            ].map((field) => (
              <div key={field.key}>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}</label>
                <input type={field.type} value={general[field.key] || ''} onChange={(e) => setGeneral({ ...general, [field.key]: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payment' && (
          <div>
            <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>Payment Settings</h3>
            <div className="space-y-3 mb-6">
              <h4 className={`font-medium text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Payment Methods</h4>
              {[
                { key: 'bkash', label: 'bKash' },
                { key: 'nagad', label: 'Nagad' },
                { key: 'sslcommerz', label: 'SSLCommerz' },
                { key: 'visa', label: 'Visa' },
                { key: 'mastercard', label: 'MasterCard' },
                { key: 'amex', label: 'American Express' },
              ].map((m) => (
                <label key={m.key} className="flex items-center gap-3">
                  <input type="checkbox" checked={payment[m.key] || false} onChange={() => setPayment({ ...payment, [m.key]: !payment[m.key] })} className="rounded text-[#7c3aed]" />
                  <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{m.label}</span>
                </label>
              ))}
            </div>
            <div>
              <h4 className={`font-medium text-sm mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Environment</h4>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={payment.live_mode || false} onChange={() => setPayment({ ...payment, live_mode: !payment.live_mode })} className="rounded text-[#7c3aed]" />
                <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Live Mode (uncheck for sandbox/test)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>Email Settings (SMTP)</h3>
            </div>
            {[
              { key: 'smtp_host', label: 'SMTP Host', type: 'text' },
              { key: 'smtp_port', label: 'SMTP Port', type: 'text' },
              { key: 'smtp_user', label: 'SMTP Username', type: 'text' },
              { key: 'smtp_pass', label: 'SMTP Password', type: 'password' },
              { key: 'from_name', label: 'From Name', type: 'text' },
              { key: 'from_email', label: 'From Email', type: 'email' },
            ].map((field) => (
              <div key={field.key}>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}</label>
                <input type={field.type} value={email[field.key] || ''} onChange={(e) => setEmail({ ...email, [field.key]: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t dark:border-gray-700">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

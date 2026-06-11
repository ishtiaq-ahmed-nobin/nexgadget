import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import SectionTitle from '../../components/common/SectionTitle'
import HeroBanner from '../../components/common/HeroBanner'
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function Contact() {
  const { dark } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Message sent! We will get back to you shortly.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div>
      <HeroBanner title="Contact Us" subtitle="We'd love to hear from you. Get in touch with our team." />

      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionTitle title="Send Us a Message" />
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        dark ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        dark ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                  <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      dark ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      dark ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}></textarea>
                </div>
                <button type="submit" disabled={sending}
                  className="px-8 py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div>
              <SectionTitle title="Get in Touch" />
              <div className="space-y-6">
                {[
                  { icon: HiMail, label: 'Email', value: 'support@nexgadget.com', sub: 'We reply within 24 hours' },
                  { icon: HiPhone, label: 'Phone', value: '+1 (555) 123-4567', sub: 'Mon-Sat, 9AM-8PM' },
                  { icon: HiLocationMarker, label: 'Office', value: '123 Gadget Street, Tech City, TC 10001', sub: 'Visit us during business hours' },
                  { icon: HiClock, label: 'Business Hours', value: 'Mon-Sat: 9:00 AM - 8:00 PM', sub: 'Sunday: 10:00 AM - 6:00 PM' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-[#7c3aed]" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>{item.label}</h3>
                      <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{item.value}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-8 h-64 rounded-xl overflow-hidden ${dark ? 'bg-[#1e293b]' : 'bg-gray-100'} flex items-center justify-center`}>
                <div className="text-center">
                  <HiLocationMarker className="w-8 h-8 text-[#7c3aed] mx-auto mb-2" />
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Google Map</p>
                  <p className="text-xs text-gray-400">123 Gadget Street, Tech City</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

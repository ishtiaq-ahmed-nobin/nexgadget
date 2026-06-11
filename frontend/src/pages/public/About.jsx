import { useTheme } from '../../context/ThemeContext'
import SectionTitle from '../../components/common/SectionTitle'
import HeroBanner from '../../components/common/HeroBanner'

const team = [
  { name: 'Alex Morgan', role: 'CEO & Founder', img: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Sarah Chen', role: 'CTO', img: 'https://i.pravatar.cc/150?img=5' },
  { name: 'James Wilson', role: 'Head of Operations', img: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Lisa Park', role: 'Marketing Director', img: 'https://i.pravatar.cc/150?img=9' },
]

const milestones = [
  { year: '2020', event: 'Company founded with a vision to revolutionize gadget shopping' },
  { year: '2021', event: 'Launched our e-commerce platform with 500+ products' },
  { year: '2022', event: 'Introduced inventory management system for retailers' },
  { year: '2023', event: 'Expanded to serve 10,000+ customers nationwide' },
  { year: '2024', event: 'Integrated multiple payment gateways and mobile banking' },
  { year: '2025', event: 'Reached 50,000+ products and 100+ brands' },
]

const stats = [
  { value: '50K+', label: 'Products' },
  { value: '100+', label: 'Brands' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '99.9%', label: 'Uptime' },
]

export default function About() {
  const { dark } = useTheme()

  return (
    <div>
      <HeroBanner title="About NexGadget" subtitle="Learn about our journey, mission, and the team behind your favorite gadget store" btnText="Contact Us" btnLink="/contact" />

      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle title="Company Overview" />
              <p className={`text-base leading-relaxed mb-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                NexGadget is a modern gadget-focused e-commerce platform with integrated inventory management capabilities. 
                Founded in 2020, we enable customers to browse, search, review, and purchase gadgets online while providing 
                administrators with powerful tools for managing products, inventory, orders, customers, reports, and payments.
              </p>
              <p className={`text-base leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                Our platform serves as a complete solution for gadget retailers, combining a seamless shopping experience 
                with enterprise-grade inventory management. We're committed to delivering the latest technology at the best prices.
              </p>
            </div>
            <div className={`rounded-xl overflow-hidden ${dark ? 'bg-[#1e293b]' : 'bg-gray-50'} p-8`}>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="text-3xl font-bold text-[#7c3aed]">{s.value}</div>
                    <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Our Mission & Vision" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`p-8 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
              <div className="w-14 h-14 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-800'}`}>Our Mission</h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                To make cutting-edge technology accessible to everyone by providing a seamless, secure, 
                and enjoyable shopping experience combined with powerful inventory management tools for businesses.
              </p>
            </div>
            <div className={`p-8 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
              <div className="w-14 h-14 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🔭</span>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-800'}`}>Our Vision</h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                To become the leading gadget e-commerce and inventory management platform, empowering retailers 
                and delighting customers with innovation, reliability, and exceptional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Our Journey" subtitle="Key milestones in our growth story" />
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#7c3aed]/30"></div>
            {milestones.map((m, i) => (
              <div key={i} className="relative pl-12 pb-8">
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[#7c3aed] border-2 border-white"></div>
                <div className={`p-4 rounded-lg ${dark ? 'bg-[#1e293b]' : 'bg-gray-50'}`}>
                  <span className="text-[#7c3aed] font-bold text-sm">{m.year}</span>
                  <p className={`text-sm mt-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Meet Our Team" subtitle="The passionate people behind NexGadget" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((t, i) => (
              <div key={i} className="text-center">
                <img src={t.img} alt={t.name} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover ring-2 ring-[#7c3aed]/20" />
                <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>{t.name}</h3>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

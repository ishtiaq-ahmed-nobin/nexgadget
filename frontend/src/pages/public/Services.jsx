import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import SectionTitle from '../../components/common/SectionTitle'
import HeroBanner from '../../components/common/HeroBanner'
import { HiShieldCheck, HiChip, HiTruck, HiSupport, HiCog, HiStar } from 'react-icons/hi'

const services = [
  { icon: HiShieldCheck, title: 'Warranty Services', desc: 'All products come with manufacturer warranty. We handle claims and replacements seamlessly.' },
  { icon: HiChip, title: 'Technical Support', desc: 'Expert technical assistance for setup, troubleshooting, and optimization of your gadgets.' },
  { icon: HiTruck, title: 'Delivery Services', desc: 'Fast, insured delivery with real-time tracking. Free shipping on orders over ৳50.' },
  { icon: HiCog, title: 'Product Installation', desc: 'Professional installation services for complex gadgets and smart home devices.' },
  { icon: HiSupport, title: 'Repair Services', desc: 'Certified repair center for all major brands. Quick turnaround with genuine parts.' },
  { icon: HiStar, title: 'Customer Support', desc: 'Dedicated support team available 24/7 via phone, email, and live chat.' },
]

const packages = [
  { name: 'Basic', price: '৳9.99/mo', features: ['Standard warranty', 'Email support', '48hr response', 'Software support'] },
  { name: 'Premium', price: '৳19.99/mo', features: ['Extended warranty', 'Priority support', '24hr response', 'On-site service', 'Free installation'] },
  { name: 'Business', price: '৳49.99/mo', features: ['Full coverage', 'Dedicated manager', '4hr response', 'On-site 24/7', 'Bulk discounts', 'Custom solutions'] },
]

const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available within 24-48 hours.' },
  { q: 'What is your warranty policy?', a: 'All products come with a minimum 1-year manufacturer warranty. Extended warranty available for purchase.' },
  { q: 'Do you offer technical support?', a: 'Yes, our technical support team is available 24/7 via phone, email, and live chat.' },
  { q: 'Can I return a product?', a: 'Yes, we offer 30-day hassle-free returns for most products. Conditions apply.' },
]

export default function Services() {
  const { dark } = useTheme()

  return (
    <div>
      <HeroBanner
        title="Our Services"
        subtitle="Comprehensive support and services for all your gadget needs"
        btnText="Contact Us"
        btnLink="/contact"
      />

      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="What We Offer" subtitle="End-to-end services for a seamless experience" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-gray-50'} hover:shadow-lg transition-shadow`}>
                <div className="w-12 h-12 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-[#7c3aed]" />
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Service Packages" subtitle="Choose the plan that fits your needs" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg, i) => (
              <div key={i} className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md ${i === 1 ? 'ring-2 ring-[#7c3aed] relative' : ''}`}>
                {i === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#7c3aed] text-white text-xs font-bold rounded-full">Popular</span>}
                <h3 className={`text-xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-800'}`}>{pkg.name}</h3>
                <p className="text-3xl font-bold text-[#7c3aed] mb-4">{pkg.price}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f, j) => (
                    <li key={j} className={`text-sm flex items-center gap-2 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="text-[#7c3aed]">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="block text-center py-2.5 rounded-lg bg-[#7c3aed] text-white font-medium hover:bg-[#6d28d9] transition-colors">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-3xl mx-auto px-4">
          <SectionTitle title="Frequently Asked Questions" subtitle="Quick answers to common questions" />
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className={`group rounded-xl overflow-hidden ${dark ? 'bg-[#1e293b]' : 'bg-gray-50'}`}>
                <summary className={`px-6 py-4 font-medium cursor-pointer list-none flex items-center justify-between ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {faq.q}
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className={`px-6 pb-4 text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

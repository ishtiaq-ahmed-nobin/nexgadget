import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  const { dark } = useTheme()

  return (
    <footer className={dark ? 'bg-[#0f172a] text-gray-300' : 'bg-gray-900 text-gray-300'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#7c3aed] text-2xl">◆</span>
              <span className="text-xl font-bold text-white">NexGadget</span>
            </div>
            <p className="text-sm leading-relaxed">
              Modern gadget e-commerce platform with integrated inventory management. 
              Discover top smartphones, laptops, wearables and accessories.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#7c3aed] transition-colors"><FaFacebook /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#7c3aed] transition-colors"><FaTwitter /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#7c3aed] transition-colors"><FaInstagram /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#7c3aed] transition-colors"><FaLinkedin /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-[#a855f7] transition-colors">Shop</Link></li>
              <li><Link to="/services" className="hover:text-[#a855f7] transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-[#a855f7] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#a855f7] transition-colors">Contact Us</Link></li>
              <li><Link to="/cart" className="hover:text-[#a855f7] transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?category=smartphones" className="hover:text-[#a855f7] transition-colors">Smartphones</Link></li>
              <li><Link to="/shop?category=laptops" className="hover:text-[#a855f7] transition-colors">Laptops</Link></li>
              <li><Link to="/shop?category=tablets" className="hover:text-[#a855f7] transition-colors">Tablets</Link></li>
              <li><Link to="/shop?category=smart-watches" className="hover:text-[#a855f7] transition-colors">Smart Watches</Link></li>
              <li><Link to="/shop?category=headphones" className="hover:text-[#a855f7] transition-colors">Headphones</Link></li>
              <li><Link to="/shop?category=gaming" className="hover:text-[#a855f7] transition-colors">Gaming Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li>123 Gadget Street, Tech City</li>
              <li>support@nexgadget.com</li>
              <li>+1 (555) 123-4567</li>
              <li className="pt-2">
                <span className="text-white font-medium">Business Hours:</span><br />
                Mon - Sat: 9:00 AM - 8:00 PM<br />
                Sun: 10:00 AM - 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${dark ? 'border-gray-800' : 'border-gray-700'} mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm`}>
          <div>&copy; {new Date().getFullYear()} NexGadget. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#a855f7] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#a855f7] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

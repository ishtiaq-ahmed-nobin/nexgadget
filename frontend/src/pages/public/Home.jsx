import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../../store/slices/productSlice'
import ProductCard from '../../components/common/ProductCard'
import SectionTitle from '../../components/common/SectionTitle'
import { useTheme } from '../../context/ThemeContext'
import { heroImages } from '../../data/products'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { HiArrowRight, HiShieldCheck, HiTruck, HiSupport, HiRefresh, HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi'

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
}

const heroSlides = [
  {
    title: 'Discover the Latest Gadgets',
    subtitle: 'Explore premium smartphones, laptops, wearables and more at unbeatable prices.',
    btnText: 'Shop Now',
    btnLink: '/shop',
    bg: 'from-[#2e1c2b] via-[#4a1942] to-[#7c3aed]',
    image: heroImages[0],
  },
  {
    title: 'Smart Technology, Smart Prices',
    subtitle: 'Get the best deals on top-brand electronics with fast delivery and warranty.',
    btnText: 'View Deals',
    btnLink: '/shop?sort=discount',
    bg: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]',
    image: heroImages[1],
  },
  {
    title: 'Power Your Productivity',
    subtitle: 'From high-performance laptops to cutting-edge tablets — work smarter.',
    btnText: 'Explore',
    btnLink: '/shop?category=laptops',
    bg: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
    image: heroImages[2],
  },
]

const testimonials = [
  { name: 'Sarah Johnson', role: 'Tech Enthusiast', text: 'Amazing selection and fast shipping! The product quality exceeded my expectations.', rating: 5 },
  { name: 'Michael Chen', role: 'Business Owner', text: 'NexGadget transformed our inventory management. Highly recommended for gadget retailers.', rating: 5 },
  { name: 'Emily Rodriguez', role: 'Developer', text: 'Great prices and excellent customer support. My go-to store for all tech needs.', rating: 4 },
  { name: 'David Kim', role: 'Gamer', text: 'Found the perfect gaming setup here. The detailed specs helped me make the right choice.', rating: 5 },
]

const whyChooseUs = [
  { icon: HiShieldCheck, title: 'Genuine Products', desc: '100% authentic gadgets with manufacturer warranty' },
  { icon: HiTruck, title: 'Fast Delivery', desc: 'Free shipping on orders over ৳50, delivered in 2-5 days' },
  { icon: HiSupport, title: '24/7 Support', desc: 'Round-the-clock customer service for all your needs' },
  { icon: HiRefresh, title: 'Easy Returns', desc: '30-day hassle-free return policy, no questions asked' },
]

const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'OnePlus', 'Xiaomi']

export default function Home() {
  const dispatch = useDispatch()
  const { items: products, categories, loading } = useSelector((s) => s.products)
  const { dark } = useTheme()
  const [heroSlide, setHeroSlide] = useState(0)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((p) => (p + 1) % heroSlides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const featured = products?.filter?.((p) => p.featured)?.length ? products.filter((p) => p.featured) : products?.slice?.(0, 8) || []
  const trending = products?.slice?.(0, 8) || []
  const newArrivals = [...(products || [])].reverse().slice(0, 8)
  const bestSellers = products?.slice?.(0, 8) || []

  return (
    <div>
      {/* 1. Hero Banner Slider */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === heroSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`}></div>
            <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-100" style={{ backgroundImage: 'url(' + slide.image + ')' }}></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8">{slide.subtitle}</p>
                <Link to={slide.btnLink} className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#2e1c2b] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                  {slide.btnText} <HiArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === heroSlide ? 'bg-white w-8' : 'bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Shop by Category" subtitle="Find exactly what you need from our wide range of categories" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Smartphones', icon: '📱', slug: 'smartphones' },
              { name: 'Laptops', icon: '💻', slug: 'laptops' },
              { name: 'Tablets', icon: '📲', slug: 'tablets' },
              { name: 'Smart Watches', icon: '⌚', slug: 'smart-watches' },
              { name: 'Headphones', icon: '🎧', slug: 'headphones' },
              { name: 'Gaming', icon: '🎮', slug: 'gaming' },
            ].map((cat) => (
              <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className={`group p-6 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 ${dark ? 'bg-[#1e293b] hover:bg-[#334155]' : 'bg-gray-50 hover:bg-purple-50'} hover:shadow-lg`}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trending Products Slider */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Trending Products" subtitle="Most popular gadgets our customers love" />
          <Slider {...sliderSettings}>
            {trending.map((p) => (
              <div key={p.id}><ProductCard product={p} /></div>
            ))}
          </Slider>
        </div>
      </section>

      {/* 4. New Arrivals */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="New Arrivals" subtitle="Be the first to own the latest gadgets" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={{ ...p, is_new: true }} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Best Sellers */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Best Sellers" subtitle="Top-rated products trusted by thousands" />
          <Slider {...sliderSettings}>
            {bestSellers.map((p) => (
              <div key={p.id}><ProductCard product={p} /></div>
            ))}
          </Slider>
        </div>
      </section>

      {/* 6. Featured Products Grid */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Featured Products" subtitle="Handpicked gadgets with the best value and performance" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors shadow-lg">
              View All Products <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Technology Showcase */}
      <section className="py-16 bg-gradient-to-r from-[#2e1c2b] via-[#4a1942] to-[#7c3aed]">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Built With Modern Tech" subtitle="Powered by cutting-edge technology stack" light />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {['React.js', 'PHP', 'MySQL', 'Redux Toolkit', 'Tailwind CSS', 'Material UI', 'REST API', 'Node.js'].map((tech) => (
              <div key={tech} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors">
                <div className="text-white font-semibold text-sm">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Featured Brands */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Featured Brands" subtitle="We partner with the world's leading brands" />
          <div className="flex flex-wrap justify-center gap-8">
            {brands.map((brand) => (
              <div key={brand} className={`px-6 py-4 rounded-xl font-bold text-lg ${dark ? 'text-gray-400 bg-[#1e293b]' : 'text-gray-500 bg-gray-100'}`}>
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Promotional Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#a855f7]"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Summer Sale — Up to 40% Off</h2>
          <p className="text-lg text-purple-100 mb-8">Limited time offer on selected gadgets. Don't miss out!</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#7c3aed] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
            Shop Now <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 9. Customer Review Slider */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="What Our Customers Say" subtitle="Trusted by thousands of satisfied customers" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <HiStar key={j} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className={`text-sm mb-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>"{t.text}"</p>
                <div>
                  <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Why Choose Us */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Why Choose NexGadget" subtitle="We deliver more than just products" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <div key={i} className={`p-6 rounded-xl text-center ${dark ? 'bg-[#1e293b]' : 'bg-gray-50'}`}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-[#7c3aed]" />
                </div>
                <h3 className={`font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>{item.title}</h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Newsletter */}
      <section className="py-16 bg-gradient-to-r from-[#2e1c2b] to-[#4a1942]">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-3">Stay Updated</h2>
          <p className="text-gray-300 mb-6">Subscribe to get exclusive deals, new arrivals, and tech insights.</p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }} className="flex gap-2 max-w-md mx-auto">
            <input type="email" required placeholder="Your email address" className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-[#a855f7] text-gray-900" />
            <button type="submit" className="px-6 py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </section>

      {/* 12. Contact CTA */}
      <section className={`py-16 ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className={`text-3xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Questions? We're Here to Help</h2>
          <p className={`text-lg mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Need help with a product, order, or anything else? Our support team is just a message away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors shadow-lg">
              Contact Us <HiArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/shop" className={`inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg transition-colors shadow-lg border ${dark ? 'border-gray-600 text-gray-300 hover:bg-[#1e293b]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

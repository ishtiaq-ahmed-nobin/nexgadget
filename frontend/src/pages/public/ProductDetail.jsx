import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearSelectedProduct } from '../../store/slices/productSlice'
import { addToCart } from '../../store/slices/cartSlice'
import { useTheme } from '../../context/ThemeContext'
import { useCartDrawer } from '../../context/CartDrawerContext'
import ProductCard from '../../components/common/ProductCard'
import { HiStar, HiShoppingCart, HiMinus, HiPlus, HiShieldCheck, HiTruck, HiRefresh } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selectedProduct: product, loading } = useSelector((s) => s.products)
  const { items: allProducts } = useSelector((s) => s.products)
  const { dark } = useTheme()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    dispatch(fetchProductById(id))
    return () => dispatch(clearSelectedProduct())
  }, [dispatch, id])

  const { openCart } = useCartDrawer()

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }))
      toast.success(`${product.name} added to cart!`)
      openCart()
    }
  }

  if (loading) return (
    <div className={dark ? 'bg-[#0f172a] min-h-screen' : 'bg-gray-50 min-h-screen'}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className={`aspect-square rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-gray-200'}`}></div>
          <div className="space-y-4">
            <div className={`h-4 w-1/4 rounded ${dark ? 'bg-[#1e293b]' : 'bg-gray-200'}`}></div>
            <div className={`h-8 w-3/4 rounded ${dark ? 'bg-[#1e293b]' : 'bg-gray-200'}`}></div>
            <div className={`h-6 w-1/4 rounded ${dark ? 'bg-[#1e293b]' : 'bg-gray-200'}`}></div>
            <div className={`h-20 w-full rounded ${dark ? 'bg-[#1e293b]' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className="text-center">
        <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Product not found</p>
        <Link to="/shop" className="mt-4 inline-block text-[#7c3aed] hover:underline">Back to shop</Link>
      </div>
    </div>
  )

  const images = product.gallery || product.images || [product.image]
  const rating = product.rating || product.average_rating || 4.5
  const relatedProducts = allProducts?.filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.category === product.category)).slice(0, 4) || []

  return (
    <div className={dark ? 'bg-[#0f172a] min-h-screen' : 'bg-gray-50 min-h-screen'}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-gray-500 hover:text-[#7c3aed]">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-[#7c3aed]">Shop</Link>
          <span className="text-gray-400">/</span>
          <span className={dark ? 'text-gray-300' : 'text-gray-700'}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className={`aspect-square rounded-xl overflow-hidden ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md mb-4`}>
              <img src={images[selectedImage] || product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-[#7c3aed]' : dark ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className={`text-sm font-medium uppercase tracking-wider mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {product.category || product.category_name || 'Gadget'}
            </p>
            <h1 className={`text-3xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : dark ? 'text-gray-600' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {rating} ({product.review_count || product.reviews_count || 0} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-bold text-[#7c3aed]">৳{product.discount_price}</span>
                  <span className={`text-xl line-through ${dark ? 'text-gray-500' : 'text-gray-400'}`}>৳{product.price}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">Sale</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-[#7c3aed]">৳{product.price}</span>
              )}
            </div>

            <p className={`mb-6 leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className={`font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>Variants</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <span key={i} className={`px-3 py-1 rounded-lg text-sm border ${dark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                      {v.color || v.ram || v.storage || v.model || v.brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center rounded-lg border ${dark ? 'border-gray-700' : 'border-gray-300'}`}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={`p-3 ${dark ? 'hover:bg-[#334155]' : 'hover:bg-gray-100'}`}>
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className={`px-6 font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className={`p-3 ${dark ? 'hover:bg-[#334155]' : 'hover:bg-gray-100'}`}>
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors">
                <HiShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: HiShieldCheck, text: 'Genuine Products' },
                { icon: HiTruck, text: 'Free Delivery' },
                { icon: HiRefresh, text: 'Easy Returns' },
              ].map((item, i) => (
                <div key={i} className={`flex flex-col items-center p-3 rounded-lg ${dark ? 'bg-[#1e293b]' : 'bg-gray-100'}`}>
                  <item.icon className="w-5 h-5 text-[#7c3aed] mb-1" />
                  <span className={`text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className={`text-2xl font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

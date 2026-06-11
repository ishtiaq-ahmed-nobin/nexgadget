import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { useTheme } from '../../context/ThemeContext'
import { useCartDrawer } from '../../context/CartDrawerContext'
import { HiStar, HiShoppingCart } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { dark } = useTheme()
  const { openCart } = useCartDrawer()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success(`${product.name} added to cart!`)
    openCart()
  }

  const rating = product.rating || product.average_rating || 4.5

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'
        } shadow-md`}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-200 dark:bg-gray-700">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          decoding="async"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-100"
        />
        {product.discount_price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{Math.round((1 - product.discount_price / product.price) * 100)}%
          </span>
        )}
        {product.is_new && (
          <span className="absolute top-2 right-2 bg-[#7c3aed] text-white text-xs font-bold px-2 py-1 rounded-md">
            New
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#7c3aed] hover:text-white dark:opacity-60 dark:group-hover:opacity-100 dark:hover:bg-[#7c3aed] dark:hover:text-white dark:text-gray-300"
        >
          <HiShoppingCart className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {product.category || product.category_name || 'Gadget'}
        </p>
        <h3 className={`font-semibold text-sm leading-tight mb-2 line-clamp-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <HiStar key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-yellow-400' : dark ? 'text-gray-600' : 'text-gray-300'}`} />
          ))}
          <span className={`text-xs ml-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>({product.review_count || product.reviews_count || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          {product.discount_price ? (
            <>
              <span className="text-lg font-bold text-[#7c3aed]">৳{product.discount_price}</span>
              <span className={`text-sm line-through ${dark ? 'text-gray-500' : 'text-gray-400'}`}>৳{product.price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-[#7c3aed]">৳{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

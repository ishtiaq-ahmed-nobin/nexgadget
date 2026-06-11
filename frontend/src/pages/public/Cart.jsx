import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateQuantity, removeFromCart, clearCart, selectCartItems, selectCartTotal } from '../../store/slices/cartSlice'
import { useTheme } from '../../context/ThemeContext'
import { HiTrash, HiMinus, HiPlus, HiArrowLeft, HiShoppingCart, HiShieldCheck, HiTruck, HiRefresh } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function Cart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const { dark } = useTheme()

  const shipping = total >= 50 ? 0 : 5.99
  const tax = total * 0.08
  const grandTotal = total + shipping + tax

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
  }

  if (items.length === 0) return (
    <div className={`min-h-[60vh] flex items-center justify-center ${dark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className="text-center max-w-md mx-auto px-4">
        <HiShoppingCart className={`w-20 h-20 mx-auto mb-6 ${dark ? 'text-gray-600' : 'text-gray-300'}`} />
        <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>Your cart is empty</h2>
        <p className={`mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Looks like you haven't added any products yet. Start exploring our collection!</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors">
          <HiArrowLeft className="w-5 h-5" /> Continue Shopping
        </Link>
      </div>
    </div>
  )

  return (
    <div className={dark ? 'bg-[#0f172a] min-h-screen' : 'bg-gray-50 min-h-screen'}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${dark ? 'text-white' : 'text-gray-900'}`}>Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className={`p-4 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md flex gap-4`}>
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                  <img src={item.product.image || '/placeholder.png'} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className={`font-semibold truncate ${dark ? 'text-white hover:text-[#a855f7]' : 'text-gray-800 hover:text-[#7c3aed]'}`}>
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className={`text-sm mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Unit: ৳{item.product.discount_price || item.product.price}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center rounded-lg border ${dark ? 'border-gray-700' : 'border-gray-300'}`}>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))}
                        className={`p-1.5 ${dark ? 'hover:bg-[#334155]' : 'hover:bg-gray-100'}`}>
                        <HiMinus className="w-4 h-4" />
                      </button>
                      <span className={`px-4 text-sm font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))}
                        className={`p-1.5 ${dark ? 'hover:bg-[#334155]' : 'hover:bg-gray-100'}`}>
                        <HiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#7c3aed]">৳{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}</span>
                      <button onClick={() => { dispatch(removeFromCart(item.product.id)); toast.success('Item removed') }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Link to="/shop" className={`flex items-center gap-1 text-sm ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <HiArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
              <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared') }}
                className={`text-sm ${dark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md h-fit`}>
            <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>৳{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Shipping</span>
                <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {shipping === 0 ? 'Free' : `৳${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Tax (8%)</span>
                <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>৳{tax.toFixed(2)}</span>
              </div>
              <hr className={dark ? 'border-gray-700' : 'border-gray-200'} />
              <div className="flex justify-between font-bold text-lg">
                <span className={dark ? 'text-white' : 'text-gray-800'}>Total</span>
                <span className="text-[#7c3aed]">৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" onClick={handleCheckout}
              className="block text-center w-full py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors">
              Proceed to Checkout
            </Link>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><HiShieldCheck className="text-green-500" /> Secure</span>
              <span className="flex items-center gap-1"><HiTruck className="text-green-500" /> Free over ৳50</span>
              <span className="flex items-center gap-1"><HiRefresh className="text-green-500" /> 30-day returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

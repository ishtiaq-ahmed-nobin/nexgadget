import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useCartDrawer } from '../../context/CartDrawerContext'
import { updateQuantity, removeFromCart, selectCartItems, selectCartTotal } from '../../store/slices/cartSlice'
import { useTheme } from '../../context/ThemeContext'
import { HiX, HiMinus, HiPlus, HiTrash, HiShoppingCart, HiArrowRight } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const { isOpen, closeCart } = useCartDrawer()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const { dark } = useTheme()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[70] transform transition-transform duration-300 shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${dark ? 'bg-[#0f172a]' : 'bg-white'}`}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <HiShoppingCart className={`w-6 h-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`} />
              <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                Shopping Cart
                {items.length > 0 && (
                  <span className={`ml-2 text-sm font-normal ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={closeCart}
              className={`p-2 rounded-lg ${dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <HiShoppingCart className={`w-16 h-16 mb-4 ${dark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Your cart is empty</p>
                <p className={`text-sm mb-6 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Add some products to get started!</p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2 bg-[#7c3aed] text-white font-medium rounded-lg hover:bg-[#6d28d9] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className={`flex gap-3 p-3 rounded-xl ${dark ? 'bg-[#1e293b]' : 'bg-gray-50'}`}
                  >
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={closeCart}
                      className="w-20 h-20 shrink-0 rounded-lg overflow-hidden"
                    >
                      <img
                        src={item.product.image || '/placeholder.png'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={closeCart}
                        className={`text-sm font-semibold line-clamp-2 hover:text-[#7c3aed] ${dark ? 'text-white' : 'text-gray-800'}`}
                      >
                        {item.product.name}
                      </Link>
                      <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        ৳{item.product.discount_price || item.product.price} each
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className={`flex items-center rounded-md border ${dark ? 'border-gray-600' : 'border-gray-300'}`}>
                          <button
                            onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))}
                            className={`p-1 ${dark ? 'hover:bg-[#334155]' : 'hover:bg-gray-200'}`}
                          >
                            <HiMinus className="w-3 h-3" />
                          </button>
                          <span className={`px-3 text-xs font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))}
                            className={`p-1 ${dark ? 'hover:bg-[#334155]' : 'hover:bg-gray-200'}`}
                          >
                            <HiPlus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#7c3aed]">
                            ৳{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => { dispatch(removeFromCart(item.product.id)); toast.success('Item removed') }}
                            className="p-1 text-red-400 hover:text-red-600 rounded"
                          >
                            <HiTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className={`px-6 py-4 border-t ${dark ? 'border-gray-700' : 'border-gray-200'} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Subtotal</span>
                <span className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>৳{total.toFixed(2)}</span>
              </div>
              <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Shipping & taxes calculated at checkout
              </p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors"
              >
                Checkout <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cart"
                onClick={closeCart}
                className={`block text-center text-sm font-medium ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                View Full Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

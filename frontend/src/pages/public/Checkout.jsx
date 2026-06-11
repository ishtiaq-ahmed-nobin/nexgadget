import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { selectCartItems, selectCartTotal, clearCart } from '../../store/slices/cartSlice'
import { createOrderApi } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

function cx(dark, lightClass, darkClass) {
  return dark ? darkClass : lightClass
}

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const { user } = useSelector((s) => s.auth)
  const { dark } = useTheme()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    notes: '',
  })

  const shipping = total >= 50 ? 0 : 5.99
  const tax = total * 0.08
  const grandTotal = total + shipping + tax

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    setLoading(true)
    try {
      const payload = {
        customer: { name: form.firstName + ' ' + form.lastName, email: form.email, phone: form.phone },
        shipping: form,
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity, price: i.product.price })),
        total: grandTotal,
        payment_method: paymentMethod,
      }
      await createOrderApi(payload)
      dispatch(clearCart())
      toast.success('Order placed successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    const textColor = dark ? 'text-white' : 'text-gray-800'
    const subColor = dark ? 'text-gray-400' : 'text-gray-500'
    return (
      <div className={'min-h-[60vh] flex items-center justify-center ' + (dark ? 'bg-[#0f172a]' : 'bg-gray-50')}>
        <div className="text-center">
          <h2 className={'text-2xl font-bold mb-2 ' + textColor}>Nothing to checkout</h2>
          <p className={'mb-4 ' + subColor}>Your cart is empty. Add some products first.</p>
          <Link to="/shop" className="text-[#7c3aed] hover:underline">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#7c3aed] ' + (dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300')
  const labelClass = 'block text-sm font-medium mb-1 ' + (dark ? 'text-gray-300' : 'text-gray-700')
  const cardBg = dark ? 'bg-[#1e293b]' : 'bg-white'
  const textWhite = dark ? 'text-white' : 'text-gray-800'
  const textGray = dark ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className={(dark ? 'bg-[#0f172a]' : 'bg-gray-50') + ' min-h-screen'}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={'text-3xl font-bold mb-8 ' + textWhite}>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className={'p-6 rounded-xl ' + cardBg + ' shadow-md'}>
                <h2 className={'text-xl font-bold mb-4 ' + textWhite}>Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className={'p-6 rounded-xl ' + cardBg + ' shadow-md'}>
                <h2 className={'text-xl font-bold mb-4 ' + textWhite}>Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Address *</label>
                    <input type="text" name="address" required value={form.address} onChange={handleChange} placeholder="Street address" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>City *</label>
                      <input type="text" name="city" required value={form.city} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>State *</label>
                      <input type="text" name="state" required value={form.state} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>ZIP *</label>
                      <input type="text" name="zip" required value={form.zip} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={'p-6 rounded-xl ' + cardBg + ' shadow-md'}>
                <h2 className={'text-xl font-bold mb-4 ' + textWhite}>Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'card', label: 'Credit/Debit Card', desc: 'Visa, MasterCard, American Express' },
                    { value: 'bkash', label: 'bKash', desc: 'Mobile banking - Bangladesh' },
                    { value: 'nagad', label: 'Nagad', desc: 'Mobile banking - Bangladesh' },
                    { value: 'sslcommerz', label: 'SSLCommerz', desc: 'Online payment gateway' },
                  ].map((m) => (
                    <label key={m.value}
                      className={
                        (paymentMethod === m.value ? 'border-[#7c3aed] bg-[#7c3aed]/5 ' : dark ? 'border-gray-700 ' : 'border-gray-200 ') +
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors'
                      }>
                      <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} className="text-[#7c3aed]" />
                      <div>
                        <span className={'font-medium text-sm ' + (dark ? 'text-white' : 'text-gray-800')}>{m.label}</span>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className={'p-6 rounded-xl ' + cardBg + ' shadow-md'}>
                <h2 className={'text-xl font-bold mb-4 ' + textWhite}>Order Notes</h2>
                <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Special instructions or notes..." className={inputClass} />
              </div>
            </div>

            <div className="space-y-6">
              <div className={'p-6 rounded-xl ' + cardBg + ' shadow-md'}>
                <h3 className={'text-lg font-bold mb-4 ' + textWhite}>Order Summary</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img src={item.product.image || '/placeholder.png'} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={'text-sm font-medium truncate ' + (dark ? 'text-white' : 'text-gray-800')}>{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-[#7c3aed]">৳{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className={dark ? 'border-gray-700' : 'border-gray-200'} />
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className={textGray}>Subtotal</span>
                    <span className={'font-medium ' + textWhite}>৳{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={textGray}>Shipping</span>
                    <span className={'font-medium ' + textWhite}>{shipping === 0 ? 'Free' : '৳' + shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={textGray}>Tax (8%)</span>
                    <span className={'font-medium ' + textWhite}>৳{tax.toFixed(2)}</span>
                  </div>
                  <hr className={dark ? 'border-gray-700' : 'border-gray-200'} />
                  <div className="flex justify-between font-bold text-lg">
                    <span className={textWhite}>Total</span>
                    <span className="text-[#7c3aed]">৳{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#7c3aed] text-white font-bold text-lg rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50 shadow-lg">
                {loading ? 'Processing...' : 'Place Order \u2014 ৳' + grandTotal.toFixed(2)}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

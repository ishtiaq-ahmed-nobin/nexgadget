import axiosInstance from './axios'

import { products as mockProducts, categories as mockCategories } from '../data/products'

const slugToName = Object.fromEntries(mockCategories.map((c) => [c.slug.toLowerCase(), c.name]))

function getMockProducts(params = {}) {
  let filtered = [...mockProducts]
  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }
  if (params.category) {
    const catName = slugToName[params.category.toLowerCase()]
    if (catName) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === catName.toLowerCase() || p.category_name?.toLowerCase() === catName.toLowerCase())
    }
  }
  if (params.minPrice) filtered = filtered.filter((p) => p.price >= Number(params.minPrice))
  if (params.maxPrice) filtered = filtered.filter((p) => p.price <= Number(params.maxPrice))
  if (params.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price)
  if (params.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price)
  if (params.sort === 'popular') filtered.sort((a, b) => b.review_count - a.review_count)
  if (params.sort === 'discount') filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price))

  const page = params.page || 1
  const perPage = 12
  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const paged = filtered.slice(start, start + perPage)

  return { products: paged, totalPages, currentPage: page, total }
}

function hasProducts(data) {
  if (Array.isArray(data)) return data.length > 0
  if (Array.isArray(data?.products)) return data.products.length > 0
  if (Array.isArray(data?.data)) return data.data.length > 0
  return Boolean(data)
}

export const fetchProductsApi = async (params) => {
  try {
    const { data } = await axiosInstance.get('/products', { params })
    if (hasProducts(data)) return data
    console.warn('fetchProductsApi: API returned no valid products, falling back to mock data')
    return getMockProducts(params)
  } catch (err) {
    console.warn('fetchProductsApi: API call failed, falling back to mock data:', err.message)
    return getMockProducts(params)
  }
}

export const fetchProductByIdApi = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`)
    return data
  } catch {
    const found = mockProducts.find((p) => p.id === Number(id))
    return found || mockProducts[0]
  }
}

export const createProductApi = async (formData) => {
  const { data } = await axiosInstance.post('/products', formData)
  return data
}

export const updateProductApi = async (id, formData) => {
  const { data } = await axiosInstance.post(`/products/${id}`, formData)
  return data
}

export const deleteProductApi = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`)
  return data
}

export const fetchCategoriesApi = async () => {
  try {
    const { data } = await axiosInstance.get('/categories')
    const categories = Array.isArray(data) ? data : data.categories
    return categories?.length ? categories : mockCategories
  } catch {
    return mockCategories
  }
}

export const createCategoryApi = async (payload) => {
  const { data } = await axiosInstance.post('/categories', payload)
  return data
}

export const updateCategoryApi = async (id, payload) => {
  const { data } = await axiosInstance.put(`/categories/${id}`, payload)
  return data
}

export const deleteCategoryApi = async (id) => {
  const { data } = await axiosInstance.delete(`/categories/${id}`)
  return data
}

export const loginApi = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials)
  return data
}

export const registerApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/register', payload)
  return data
}

export const googleLoginApi = async (token) => {
  const { data } = await axiosInstance.post('/auth/google', { token })
  return data
}

export const forgotPasswordApi = async (email) => {
  const { data } = await axiosInstance.post('/auth/forgot-password', { email })
  return data
}

export const verifyOtpApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/verify-otp', payload)
  return data
}

export const resetPasswordApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/reset-password', payload)
  return data
}

export const createOrderApi = async (payload) => {
  const { data } = await axiosInstance.post('/orders', payload)
  return data
}

export const fetchMyOrdersApi = async () => {
  const { data } = await axiosInstance.get('/orders/my')
  return data
}

export const fetchOrdersApi = async (params) => {
  const { data } = await axiosInstance.get('/orders', { params })
  return data
}

export const updateOrderStatusApi = async (id, status) => {
  const { data } = await axiosInstance.put(`/orders/${id}/status`, { status })
  return data
}

export const updateOrderPaymentApi = async (id, payment) => {
  const { data } = await axiosInstance.put(`/orders/${id}/payment`, { payment })
  return data
}

export const fetchCustomersApi = async (params) => {
  const { data } = await axiosInstance.get('/customers', { params })
  return data
}

export const fetchCustomerDetailsApi = async (id) => {
  const { data } = await axiosInstance.get(`/customers/${id}`)
  return data
}

export const fetchInventoryApi = async () => {
  const { data } = await axiosInstance.get('/inventory')
  return data
}

export const updateStockApi = async (productId, quantity) => {
  const { data } = await axiosInstance.post(`/inventory/${productId}`, { quantity })
  return data
}

export const fetchReportsApi = async (type, params) => {
  const { data } = await axiosInstance.get(`/reports/${type}`, { params })
  return data
}

export const fetchDashboardStatsApi = async () => {
  const { data } = await axiosInstance.get('/dashboard/stats')
  return data
}

export const fetchDashboardChartsApi = async () => {
  const { data } = await axiosInstance.get('/dashboard/charts')
  return data
}

export const updateSettingsApi = async (payload) => {
  const { data } = await axiosInstance.put('/settings', payload)
  return data
}

export const fetchSettingsApi = async () => {
  const { data } = await axiosInstance.get('/settings')
  return data
}

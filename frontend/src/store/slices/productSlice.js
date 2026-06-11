import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchProductsApi, fetchProductByIdApi, fetchCategoriesApi } from '../../services/api'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await fetchProductsApi(params)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
  }
})

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await fetchProductByIdApi(id)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch product')
  }
})

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    return await fetchCategoriesApi()
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories')
  }
})

const initialState = {
  items: [],
  selectedProduct: null,
  categories: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products || action.payload.data || action.payload || []
        state.totalPages = action.payload.totalPages || action.payload.last_page || 1
        state.currentPage = action.payload.currentPage || action.payload.current_page || 1
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchProductById.pending, (state) => { state.loading = true })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload || [] })
  },
})

export const { clearSelectedProduct } = productSlice.actions
export default productSlice.reducer

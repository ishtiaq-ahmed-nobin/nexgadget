import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../../store/slices/productSlice'
import ProductCard from '../../components/common/ProductCard'
import { useTheme } from '../../context/ThemeContext'
import { HiFilter, HiX, HiSearch } from 'react-icons/hi'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'discount', label: 'Biggest Discount' },
]

export default function Shop() {
  const dispatch = useDispatch()
  const { items: products, categories, loading, totalPages, currentPage } = useSelector((s) => s.products)
  const { dark } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: parseInt(searchParams.get('page')) || 1,
  })

  const [localSearch, setLocalSearch] = useState(filters.search)

  useEffect(() => {
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.category) params.category = filters.category
    if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.page > 1) params.page = filters.page
    setSearchParams(params)
    dispatch(fetchProducts(filters))
  }, [dispatch, filters, setSearchParams])

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters((f) => ({ ...f, search: localSearch, page: 1 }))
  }

  const handleCategoryFilter = (slug) => {
    setFilters((f) => ({ ...f, category: f.category === slug ? '' : slug, page: 1 }))
  }

  const handlePriceFilter = () => {
    setFilters((f) => ({ ...f, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', sort: 'newest', minPrice: '', maxPrice: '', page: 1 })
    setLocalSearch('')
  }

  const hasFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.sort !== 'newest'

  return (
    <div className={dark ? 'bg-[#0f172a]' : 'bg-gray-50'}>
      <div className="bg-gradient-to-r from-[#2e1c2b] to-[#4a1942] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Shop</h1>
          <p className="text-gray-300 mt-2">Browse our collection of premium gadgets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className={`relative flex-1 ${dark ? 'text-gray-300' : ''}`}>
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  dark ? 'bg-[#1e293b] border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
              />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] font-medium transition-colors">Search</button>
          </form>
          <button onClick={() => setFilterOpen(!filterOpen)} className={`p-2.5 rounded-lg border ${dark ? 'border-gray-700 text-gray-300' : 'border-gray-300'} flex items-center gap-2`}>
            <HiFilter className="w-5 h-5" /> <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        <div className="flex gap-6">
          {filterOpen && (
            <div className={`w-64 shrink-0 ${dark ? 'bg-[#1e293b]' : 'bg-white'} rounded-xl p-5 h-fit shadow-md`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-sm text-[#7c3aed] hover:underline">Clear all</button>
                )}
              </div>

              <div className="mb-5">
                <h4 className={`text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Categories</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {categories?.map?.((cat) => (
                    <button key={cat.id || cat.slug} onClick={() => handleCategoryFilter(cat.slug || cat.name?.toLowerCase())}
                      className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                        filters.category === (cat.slug || cat.name?.toLowerCase())
                          ? 'bg-[#7c3aed] text-white'
                          : dark ? 'text-gray-400 hover:bg-[#334155]' : 'text-gray-600 hover:bg-gray-100'
                      }`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h4 className={`text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded border text-sm ${
                      dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-[#7c3aed]`} />
                  <span className="self-center text-gray-400">-</span>
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded border text-sm ${
                      dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-[#7c3aed]`} />
                </div>
                <button onClick={handlePriceFilter} className="mt-2 text-xs text-[#7c3aed] hover:underline">Apply</button>
              </div>

              <div>
                <h4 className={`text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Sort By</h4>
                <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                  className={`w-full px-3 py-1.5 rounded border text-sm ${
                    dark ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-[#7c3aed]`}>
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="flex-1">
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Active filters:</span>
                {filters.search && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${dark ? 'bg-[#334155] text-gray-200' : 'bg-purple-100 text-purple-700'}`}>
                    Search: "{filters.search}"
                    <button onClick={() => { setFilters(f => ({ ...f, search: '', page: 1 })); setLocalSearch('') }}><HiX className="w-3 h-3" /></button>
                  </span>
                )}
                {filters.category && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${dark ? 'bg-[#334155] text-gray-200' : 'bg-purple-100 text-purple-700'}`}>
                    {categories?.find(c => c.slug === filters.category)?.name || filters.category}
                    <button onClick={() => setFilters(f => ({ ...f, category: '', page: 1 }))}><HiX className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`rounded-xl overflow-hidden ${dark ? 'bg-[#1e293b]' : 'bg-white'} shadow-md animate-pulse`}>
                    <div className="aspect-square bg-gray-300"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20">
                <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No products found</p>
                <button onClick={clearFilters} className="mt-4 text-[#7c3aed] hover:underline">Clear filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products?.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setFilters(f => ({ ...f, page }))}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-[#7c3aed] text-white'
                            : dark ? 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]' : 'bg-white text-gray-700 hover:bg-gray-100'
                        } shadow-sm`}>
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

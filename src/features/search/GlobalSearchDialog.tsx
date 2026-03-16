import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@/stores/uiStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useCustomerStore } from '@/stores/customerStore'
import { useProductStore } from '@/stores/productStore'
import { Search, FileText, Users, Package, X } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

interface SearchResult {
  type: 'invoice' | 'customer' | 'product'
  id: string
  title: string
  subtitle: string
  path: string
}

export function GlobalSearchDialog() {
  const { globalSearchOpen, setGlobalSearchOpen } = useUIStore()
  const navigate = useNavigate()
  const { invoices } = useInvoiceStore()
  const { customers } = useCustomerStore()
  const { products } = useProductStore()
  const [query, setQuery] = useState('')

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setGlobalSearchOpen(!globalSearchOpen)
      }
      if (e.key === 'Escape') {
        setGlobalSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [globalSearchOpen, setGlobalSearchOpen])

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const matches: SearchResult[] = []

    invoices.forEach((inv) => {
      if (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerSnapshot.name.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'invoice',
          id: inv.id,
          title: inv.invoiceNumber,
          subtitle: `${inv.customerSnapshot.name} — ${formatCurrency(inv.totalAmount)}`,
          path: `/invoices/${inv.id}`,
        })
      }
    })

    customers.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.businessName?.toLowerCase().includes(q) ||
        c.gstin?.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'customer',
          id: c.id,
          title: c.name,
          subtitle: c.businessName || c.gstin || '',
          path: `/customers/${c.id}`,
        })
      }
    })

    products.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.hsnCode?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'product',
          id: p.id,
          title: p.name,
          subtitle: `${formatCurrency(p.defaultPrice)} / ${p.unit}`,
          path: '/products',
        })
      }
    })

    return matches.slice(0, 10)
  }, [query, invoices, customers, products])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      navigate(result.path)
      setGlobalSearchOpen(false)
      setQuery('')
    },
    [navigate, setGlobalSearchOpen]
  )

  if (!globalSearchOpen) return null

  const icons = {
    invoice: <FileText className="h-4 w-4 text-primary-500" />,
    customer: <Users className="h-4 w-4 text-blue-500" />,
    product: <Package className="h-4 w-4 text-green-500" />,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/40" onClick={() => setGlobalSearchOpen(false)} />
      <div className="relative z-50 w-full max-w-xl rounded-xl bg-white shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            placeholder="Search invoices, customers, products..."
          />
          <button onClick={() => setGlobalSearchOpen(false)}>
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No results found</div>
            ) : (
              results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                >
                  {icons[result.type]}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                    <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                  </div>
                  <span className="text-xs text-slate-400 capitalize">{result.type}</span>
                </button>
              ))
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="py-8 text-center text-sm text-slate-400">
            Type to search across invoices, customers, and products
          </div>
        )}
      </div>
    </div>
  )
}

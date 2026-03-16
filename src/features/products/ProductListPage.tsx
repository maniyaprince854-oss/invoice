import { useState, useMemo } from 'react'
import { useProductStore } from '@/stores/productStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { SearchInput } from '@/components/shared/SearchInput'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ProductForm } from './components/ProductForm'
import { Plus, Package, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import type { Product } from '@/types/product'

export function ProductListPage() {
  const { products, deleteProduct } = useProductStore()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.hsnCode?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  }, [products, search])

  return (
    <div>
      <PageHeader
        title="Products & Services"
        description={`${products.length} items in catalog`}
        actions={
          <button
            onClick={() => { setEditProduct(undefined); setShowForm(true) }}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products..." className="max-w-sm" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title={search ? 'No products found' : 'No products yet'}
          description={search ? 'Try adjusting your search' : 'Add products to quickly fill invoices'}
          action={
            !search && (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Add Product
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
                  {product.description && (
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{product.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditProduct(product); setShowForm(true) }}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="rounded p-1.5 text-slate-400 hover:bg-danger-50 hover:text-danger-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{formatCurrency(product.defaultPrice)}</p>
                  <p className="text-xs text-slate-500">per {product.unit}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {product.taxRate}% GST
                </span>
                {product.hsnCode && (
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">
                    HSN: {product.hsnCode}
                  </span>
                )}
                {product.isService && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                    Service
                  </span>
                )}
                {product.category && (
                  <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600">
                    {product.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductForm
        open={showForm}
        product={editProduct}
        onClose={() => { setShowForm(false); setEditProduct(undefined) }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) await deleteProduct(deleteId) }}
        title="Delete Product"
        description="This will permanently delete this product. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

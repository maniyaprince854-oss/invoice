import { useState } from 'react'
import { useProductStore } from '@/stores/productStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { UNITS, TAX_SLABS } from '@/lib/constants'
import type { Product } from '@/types/product'
import { X, Save } from 'lucide-react'

interface ProductFormProps {
  product?: Product
  open: boolean
  onClose: () => void
}

export function ProductForm({ product, open, onClose }: ProductFormProps) {
  const { addProduct, updateProduct } = useProductStore()
  const defaultTaxRate = useSettingsStore((s) => s.gst.defaultTaxRate)
  const [form, setForm] = useState(
    product ?? {
      name: '',
      description: '',
      sku: '',
      hsnCode: '',
      sacCode: '',
      category: '',
      unit: 'pcs',
      defaultPrice: 0,
      taxRate: defaultTaxRate,
      cessRate: 0,
      isService: false,
    }
  )
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (product) {
        await updateProduct(product.id, form)
      } else {
        await addProduct(form as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Product or Service Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Brief description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">HSN Code</label>
              <input
                type="text"
                value={form.hsnCode ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, hsnCode: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="HSN / SAC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
              <input
                type="text"
                value={form.sku ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="SKU Code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Default Price *</label>
              <input
                type="number"
                required
                value={form.defaultPrice || ''}
                onChange={(e) => setForm((f) => ({ ...f, defaultPrice: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="0.00"
                min={0}
                step={0.01}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax Rate</label>
              <select
                value={form.taxRate}
                onChange={(e) => setForm((f) => ({ ...f, taxRate: Number(e.target.value) }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                {TAX_SLABS.map((rate) => (
                  <option key={rate} value={rate}>{rate}%</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={form.category ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Category"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isService}
              onChange={(e) => setForm((f) => ({ ...f, isService: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
            />
            <span className="text-sm text-slate-700">This is a service (not a physical product)</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.name}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : product ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

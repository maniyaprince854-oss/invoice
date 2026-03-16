import { Trash2 } from 'lucide-react'
import type { InvoiceItem } from '@/types/invoice'
import { UNITS, TAX_SLABS } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatters'

interface InvoiceItemRowProps {
  item: InvoiceItem
  index: number
  onChange: (index: number, updates: Partial<InvoiceItem>) => void
  onRemove: (index: number) => void
  products: Array<{ id: string; name: string; defaultPrice: number; unit: string; taxRate: number; hsnCode?: string }>
}

export function InvoiceItemRow({ item, index, onChange, onRemove, products }: InvoiceItemRowProps) {
  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    onChange(index, {
      productId: product.id,
      name: product.name,
      rate: product.defaultPrice,
      unit: product.unit,
      taxRate: product.taxRate,
      hsnCode: product.hsnCode ?? '',
    })
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/30">
      <td className="px-2 py-2 text-center text-xs text-slate-500">{index + 1}</td>
      <td className="px-2 py-2">
        <div className="space-y-1">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange(index, { name: e.target.value })}
            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-100"
            placeholder="Item name"
            list={`products-${index}`}
          />
          <datalist id={`products-${index}`}>
            {products.map((p) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
          {products.length > 0 && (
            <select
              value={item.productId ?? ''}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full rounded border border-slate-100 bg-slate-50 px-2 py-1 text-xs text-slate-500 focus:border-primary-300 focus:outline-none"
            >
              <option value="">Select from catalog...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>
      </td>
      <td className="px-2 py-2">
        <input
          type="text"
          value={item.hsnCode ?? ''}
          onChange={(e) => onChange(index, { hsnCode: e.target.value })}
          className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs font-mono focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-100"
          placeholder="HSN"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          value={item.quantity || ''}
          onChange={(e) => onChange(index, { quantity: parseFloat(e.target.value) || 0 })}
          className="w-20 rounded border border-slate-200 px-2 py-1.5 text-sm text-right focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-100"
          min={0}
          step={1}
        />
      </td>
      <td className="px-2 py-2">
        <select
          value={item.unit}
          onChange={(e) => onChange(index, { unit: e.target.value })}
          className="w-full rounded border border-slate-200 px-1 py-1.5 text-xs focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-100"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          value={item.rate || ''}
          onChange={(e) => onChange(index, { rate: parseFloat(e.target.value) || 0 })}
          className="w-24 rounded border border-slate-200 px-2 py-1.5 text-sm text-right focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-100"
          min={0}
          step={0.01}
        />
      </td>
      <td className="px-2 py-2">
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={item.discount || ''}
            onChange={(e) => onChange(index, { discount: parseFloat(e.target.value) || 0 })}
            className="w-16 rounded border border-slate-200 px-2 py-1.5 text-sm text-right focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-100"
            min={0}
            step={0.01}
          />
          <select
            value={item.discountType}
            onChange={(e) => onChange(index, { discountType: e.target.value as 'percentage' | 'fixed' })}
            className="w-12 rounded border border-slate-200 px-1 py-1.5 text-xs focus:border-primary-300 focus:outline-none"
          >
            <option value="percentage">%</option>
            <option value="fixed">₹</option>
          </select>
        </div>
      </td>
      <td className="px-2 py-2">
        <select
          value={item.taxRate}
          onChange={(e) => onChange(index, { taxRate: Number(e.target.value) })}
          className="w-full rounded border border-slate-200 px-1 py-1.5 text-xs focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-100"
        >
          {TAX_SLABS.map((rate) => (
            <option key={rate} value={rate}>{rate}%</option>
          ))}
        </select>
      </td>
      <td className="px-2 py-2 text-right">
        <span className="text-sm font-medium text-slate-900">{formatCurrency(item.amount)}</span>
      </td>
      <td className="px-2 py-2 text-center">
        <button
          onClick={() => onRemove(index)}
          className="rounded p-1 text-slate-400 hover:bg-danger-50 hover:text-danger-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}

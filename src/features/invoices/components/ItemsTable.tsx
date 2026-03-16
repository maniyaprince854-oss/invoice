import { Plus } from 'lucide-react'
import type { InvoiceItem } from '@/types/invoice'
import { InvoiceItemRow } from './InvoiceItemRow'
import { v4 as uuid } from 'uuid'
import { useSettingsStore } from '@/stores/settingsStore'

interface ItemsTableProps {
  items: InvoiceItem[]
  onChange: (items: InvoiceItem[]) => void
  products: Array<{ id: string; name: string; defaultPrice: number; unit: string; taxRate: number; hsnCode?: string }>
}

export function ItemsTable({ items, onChange, products }: ItemsTableProps) {
  const defaultTaxRate = useSettingsStore((s) => s.gst.defaultTaxRate)

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: uuid(),
      name: '',
      hsnCode: '',
      quantity: 1,
      unit: 'pcs',
      rate: 0,
      discount: 0,
      discountType: 'percentage',
      taxRate: defaultTaxRate,
      cessRate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      amount: 0,
    }
    onChange([...items, newItem])
  }

  const updateItem = (index: number, updates: Partial<InvoiceItem>) => {
    const updated = items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 w-10">#</th>
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 min-w-[200px]">Item</th>
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 w-20">HSN</th>
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 w-20">Qty</th>
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 w-16">Unit</th>
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 w-24">Rate</th>
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 w-28">Discount</th>
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 w-16">Tax</th>
              <th className="px-2 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500 w-24 text-right">Amount</th>
              <th className="px-2 py-2.5 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <InvoiceItemRow
                key={item.id}
                item={item}
                index={index}
                onChange={updateItem}
                onRemove={removeItem}
                products={products}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 p-3">
        <button
          onClick={addItem}
          className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Line Item
        </button>
      </div>
    </div>
  )
}

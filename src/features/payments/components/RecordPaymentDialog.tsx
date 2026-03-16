import { useState } from 'react'
import { usePaymentStore } from '@/stores/paymentStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { PAYMENT_METHODS } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatters'
import { X, Save } from 'lucide-react'
import { format } from 'date-fns'

interface RecordPaymentDialogProps {
  open: boolean
  onClose: () => void
  invoiceId?: string
}

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  upi: 'UPI',
  cash: 'Cash',
  card: 'Card',
  cheque: 'Cheque',
  other: 'Other',
}

export function RecordPaymentDialog({ open, onClose, invoiceId }: RecordPaymentDialogProps) {
  const { addPayment } = usePaymentStore()
  const { invoices, updateInvoice } = useInvoiceStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    invoiceId: invoiceId ?? '',
    amount: 0,
    method: 'bank_transfer' as string,
    reference: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  })

  if (!open) return null

  const unpaidInvoices = invoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'cancelled')
  const selectedInvoice = invoices.find((inv) => inv.id === form.invoiceId)
  const balance = selectedInvoice ? selectedInvoice.totalAmount - selectedInvoice.paidAmount : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await addPayment({
        invoiceId: form.invoiceId,
        amount: form.amount,
        method: form.method as 'bank_transfer' | 'upi' | 'cash' | 'card' | 'cheque' | 'other',
        reference: form.reference,
        date: form.date,
        notes: form.notes,
      })

      // Update invoice paid amount and status
      if (selectedInvoice) {
        const newPaid = selectedInvoice.paidAmount + form.amount
        const newStatus = newPaid >= selectedInvoice.totalAmount ? 'paid' : 'partial'
        await updateInvoice(selectedInvoice.id, { paidAmount: newPaid, status: newStatus })
      }

      onClose()
      setForm({ invoiceId: '', amount: 0, method: 'bank_transfer', reference: '', date: format(new Date(), 'yyyy-MM-dd'), notes: '' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Record Payment</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Invoice *</label>
            <select
              required
              value={form.invoiceId}
              onChange={(e) => setForm((f) => ({ ...f, invoiceId: e.target.value, amount: 0 }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Select Invoice</option>
              {unpaidInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.customerSnapshot.name} ({formatCurrency(inv.totalAmount - inv.paidAmount)} due)
                </option>
              ))}
            </select>
          </div>

          {selectedInvoice && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="text-slate-500">Balance Due: <span className="font-semibold text-slate-900">{formatCurrency(balance)}</span></p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
              <input
                type="number"
                required
                value={form.amount || ''}
                onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="0.00"
                min={0}
                max={balance || undefined}
                step={0.01}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
            <select
              value={form.method}
              onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{METHOD_LABELS[m] ?? m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reference / Transaction ID</label>
            <input
              type="text"
              value={form.reference}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="UTR / Cheque No."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.invoiceId || !form.amount}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

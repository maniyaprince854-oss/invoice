import { useState, useMemo } from 'react'
import { usePaymentStore } from '@/stores/paymentStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { SearchInput } from '@/components/shared/SearchInput'
import { EmptyState } from '@/components/shared/EmptyState'
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { formatDate } from '@/lib/formatters'
import { CreditCard, Plus, Trash2 } from 'lucide-react'
import { RecordPaymentDialog } from './components/RecordPaymentDialog'

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  upi: 'UPI',
  cash: 'Cash',
  card: 'Card',
  cheque: 'Cheque',
  other: 'Other',
}

export function PaymentListPage() {
  const { payments, deletePayment } = usePaymentStore()
  const { invoices } = useInvoiceStore()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const enrichedPayments = useMemo(() => {
    return payments.map((p) => {
      const inv = invoices.find((i) => i.id === p.invoiceId)
      return { ...p, invoiceNumber: inv?.invoiceNumber ?? '—', customerName: inv?.customerSnapshot.name ?? '—' }
    })
  }, [payments, invoices])

  const filtered = useMemo(() => {
    if (!search) return enrichedPayments
    const q = search.toLowerCase()
    return enrichedPayments.filter(
      (p) =>
        p.invoiceNumber.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.reference?.toLowerCase().includes(q)
    )
  }, [enrichedPayments, search])

  return (
    <div>
      <PageHeader
        title="Payments"
        description={`${payments.length} total payments`}
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Record Payment
          </button>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search payments..." className="max-w-sm" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" />}
          title={search ? 'No payments found' : 'No payments yet'}
          description={search ? 'Try adjusting your search' : 'Record payments against invoices'}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Invoice</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 hidden sm:table-cell">Customer</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Method</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 hidden md:table-cell">Reference</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 text-right">Amount</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-700">{formatDate(payment.date)}</td>
                  <td className="px-4 py-3 text-sm font-mono font-medium text-primary-600">{payment.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 hidden sm:table-cell">{payment.customerName}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {METHOD_LABELS[payment.method] ?? payment.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">{payment.reference || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <CurrencyDisplay amount={payment.amount} size="sm" className="text-success-600 font-semibold" />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeleteId(payment.id)}
                      className="rounded p-1.5 text-slate-400 hover:bg-danger-50 hover:text-danger-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RecordPaymentDialog open={showForm} onClose={() => setShowForm(false)} />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) await deletePayment(deleteId) }}
        title="Delete Payment"
        description="This will permanently delete this payment record."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

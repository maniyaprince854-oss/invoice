import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { SearchInput } from '@/components/shared/SearchInput'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { formatDate } from '@/lib/formatters'
import { Plus, FileText, Eye, Pencil, Trash2, Copy } from 'lucide-react'
import type { InvoiceStatus } from '@/types/invoice'
import { INVOICE_STATUSES } from '@/lib/constants'

export function InvoiceListPage() {
  const navigate = useNavigate()
  const { invoices, deleteInvoice, duplicateInvoice } = useInvoiceStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter && inv.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.customerSnapshot.name.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [invoices, search, statusFilter])

  const handleDuplicate = async (id: string) => {
    const dup = await duplicateInvoice(id)
    if (dup) navigate(`/invoices/${dup.id}/edit`)
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} total invoices`}
        actions={
          <button
            onClick={() => navigate('/invoices/new')}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search invoices..." className="max-w-sm" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | '')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="">All Statuses</option>
          {INVOICE_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title={search || statusFilter ? 'No invoices found' : 'No invoices yet'}
          description={search || statusFilter ? 'Try adjusting your filters' : 'Create your first invoice to get started'}
          action={
            !search && !statusFilter && (
              <button
                onClick={() => navigate('/invoices/new')}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Create Invoice
              </button>
            )
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Invoice</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 hidden sm:table-cell">Customer</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 hidden lg:table-cell">Due Date</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 text-right">Amount</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-medium text-primary-600">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 hidden sm:table-cell">
                    {invoice.customerSnapshot.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">
                    {formatDate(invoice.issueDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 hidden lg:table-cell">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <CurrencyDisplay amount={invoice.totalAmount} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(invoice.id)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(invoice.id)}
                        className="rounded p-1.5 text-slate-400 hover:bg-danger-50 hover:text-danger-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) await deleteInvoice(deleteId) }}
        title="Delete Invoice"
        description="This will permanently delete this invoice. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

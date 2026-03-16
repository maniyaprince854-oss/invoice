import { useParams, useNavigate } from 'react-router-dom'
import { useCustomerStore } from '@/stores/customerStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay'
import { formatDate } from '@/lib/formatters'
import { ArrowLeft, FileText, Mail, Phone, MapPin } from 'lucide-react'

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const customer = useCustomerStore((s) => s.customers.find((c) => c.id === id))
  const invoices = useInvoiceStore((s) => s.invoices.filter((inv) => inv.customerId === id))

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500">Customer not found</p>
        <button onClick={() => navigate('/customers')} className="mt-4 text-sm text-primary-600 hover:text-primary-700">
          Back to Customers
        </button>
      </div>
    )
  }

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const outstanding = invoices
    .filter((inv) => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0)

  return (
    <div>
      <PageHeader
        title={customer.name}
        description={customer.businessName}
        actions={
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Total Invoices</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{invoices.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Total Revenue</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900"><CurrencyDisplay amount={totalRevenue} /></p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Outstanding</p>
          <p className="mt-1 text-2xl font-semibold text-warning-600"><CurrencyDisplay amount={outstanding} /></p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">State</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{customer.billingAddress.state || '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            {customer.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                {customer.email}
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                {customer.phone}
              </div>
            )}
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                {customer.billingAddress.line1 && <p>{customer.billingAddress.line1}</p>}
                {customer.billingAddress.city && <p>{customer.billingAddress.city}, {customer.billingAddress.state}</p>}
                {customer.billingAddress.pincode && <p>{customer.billingAddress.pincode}</p>}
              </div>
            </div>
            {customer.gstin && (
              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">GSTIN</p>
                <p className="text-sm font-mono font-medium text-slate-900">{customer.gstin}</p>
              </div>
            )}
          </div>
        </div>

        {/* Invoice History */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Invoice History</h3>
          {invoices.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No invoices yet</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{inv.invoiceNumber}</p>
                      <p className="text-xs text-slate-500">{formatDate(inv.issueDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CurrencyDisplay amount={inv.totalAmount} size="sm" />
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

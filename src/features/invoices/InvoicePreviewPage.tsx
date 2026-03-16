import { useParams, useNavigate } from 'react-router-dom'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { ArrowLeft, Pencil, Printer } from 'lucide-react'

export function InvoicePreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const invoice = useInvoiceStore((s) => s.invoices.find((inv) => inv.id === id))
  const company = useSettingsStore((s) => s.company)
  const sellerState = useSettingsStore((s) => s.gst.sellerState)

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500">Invoice not found</p>
        <button onClick={() => navigate('/invoices')} className="mt-4 text-sm text-primary-600 hover:text-primary-700">
          Back to Invoices
        </button>
      </div>
    )
  }

  const isInterState = sellerState.toLowerCase() !== (invoice.placeOfSupply || '').toLowerCase()

  const handlePrint = () => window.print()

  return (
    <div>
      <PageHeader
        title={invoice.invoiceNumber}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={() => navigate(`/invoices/${id}/edit`)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        }
      />

      {/* Invoice Preview */}
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm print:border-none print:shadow-none" id="invoice-preview">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {company.logoUrl && (
              <img src={company.logoUrl} alt="Logo" className="h-16 mb-3" />
            )}
            <h2 className="text-xl font-bold text-slate-900">{company.name || 'Your Company'}</h2>
            {company.address.line1 && <p className="text-sm text-slate-500">{company.address.line1}</p>}
            {company.address.city && (
              <p className="text-sm text-slate-500">{company.address.city}, {company.address.state} {company.address.pincode}</p>
            )}
            {company.gstin && <p className="text-sm text-slate-500 font-mono mt-1">GSTIN: {company.gstin}</p>}
            {company.phone && <p className="text-sm text-slate-500">Phone: {company.phone}</p>}
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-primary-600">TAX INVOICE</h1>
            <p className="text-sm text-slate-500 mt-2">Invoice #: <span className="font-mono font-medium text-slate-900">{invoice.invoiceNumber}</span></p>
            <p className="text-sm text-slate-500">Date: {formatDate(invoice.issueDate)}</p>
            <p className="text-sm text-slate-500">Due: {formatDate(invoice.dueDate)}</p>
            <div className="mt-2">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-500 mb-1">Bill To</p>
          <p className="text-sm font-semibold text-slate-900">{invoice.customerSnapshot.name}</p>
          {invoice.customerSnapshot.businessName && (
            <p className="text-sm text-slate-600">{invoice.customerSnapshot.businessName}</p>
          )}
          {invoice.customerSnapshot.billingAddress.line1 && (
            <p className="text-sm text-slate-600">
              {invoice.customerSnapshot.billingAddress.line1}, {invoice.customerSnapshot.billingAddress.city}, {invoice.customerSnapshot.billingAddress.state}
            </p>
          )}
          {invoice.customerSnapshot.gstin && (
            <p className="text-sm text-slate-600 font-mono">GSTIN: {invoice.customerSnapshot.gstin}</p>
          )}
          {invoice.placeOfSupply && (
            <p className="text-sm text-slate-500 mt-1">Place of Supply: {invoice.placeOfSupply}</p>
          )}
        </div>

        {/* Items Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-2 text-xs font-medium text-slate-500">#</th>
                <th className="py-2 text-xs font-medium text-slate-500">Item</th>
                <th className="py-2 text-xs font-medium text-slate-500">HSN</th>
                <th className="py-2 text-xs font-medium text-slate-500 text-right">Qty</th>
                <th className="py-2 text-xs font-medium text-slate-500 text-right">Rate</th>
                <th className="py-2 text-xs font-medium text-slate-500 text-right">Tax</th>
                <th className="py-2 text-xs font-medium text-slate-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-500">{i + 1}</td>
                  <td className="py-2 font-medium text-slate-900">{item.name}</td>
                  <td className="py-2 font-mono text-slate-500">{item.hsnCode || '—'}</td>
                  <td className="py-2 text-right text-slate-700">{item.quantity} {item.unit}</td>
                  <td className="py-2 text-right text-slate-700">{formatCurrency(item.rate)}</td>
                  <td className="py-2 text-right text-slate-500">{item.taxRate}%</td>
                  <td className="py-2 text-right font-medium text-slate-900">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {isInterState ? (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">IGST</span>
                <span className="font-medium">{formatCurrency(invoice.taxDetails.igst)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">CGST</span>
                  <span className="font-medium">{formatCurrency(invoice.taxDetails.cgst)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">SGST</span>
                  <span className="font-medium">{formatCurrency(invoice.taxDetails.sgst)}</span>
                </div>
              </>
            )}
            {invoice.shippingCharges > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium">{formatCurrency(invoice.shippingCharges)}</span>
              </div>
            )}
            {invoice.roundOff !== 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Round Off</span>
                <span className="font-medium">{formatCurrency(invoice.roundOff)}</span>
              </div>
            )}
            <div className="border-t-2 border-slate-900 pt-2">
              <div className="flex justify-between">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        {invoice.amountInWords && (
          <div className="mt-4 rounded-lg bg-slate-50 px-4 py-2">
            <p className="text-xs text-slate-500">Amount in Words: <span className="font-medium text-slate-700">{invoice.amountInWords}</span></p>
          </div>
        )}

        {/* Bank Details & Notes */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm">
          {company.bankName && (
            <div>
              <p className="font-medium text-slate-900 mb-1">Bank Details</p>
              <p className="text-slate-500">Bank: {company.bankName}</p>
              <p className="text-slate-500">A/C: {company.bankAccountNumber}</p>
              <p className="text-slate-500">IFSC: {company.bankIfsc}</p>
              {company.upiId && <p className="text-slate-500">UPI: {company.upiId}</p>}
            </div>
          )}
          <div>
            {invoice.notes && (
              <div className="mb-3">
                <p className="font-medium text-slate-900 mb-1">Notes</p>
                <p className="text-slate-500">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <p className="font-medium text-slate-900 mb-1">Terms & Conditions</p>
                <p className="text-slate-500">{invoice.terms}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

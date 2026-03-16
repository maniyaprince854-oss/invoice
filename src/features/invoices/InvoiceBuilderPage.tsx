import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useCustomerStore } from '@/stores/customerStore'
import { useProductStore } from '@/stores/productStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { ItemsTable } from './components/ItemsTable'
import { TaxSummary } from './components/TaxSummary'
import { calculateInvoiceTax, calculateRoundOff } from '@/lib/taxEngine'
import { generateInvoiceNumber } from '@/lib/invoiceNumbering'
import { numberToWords } from '@/lib/formatters'
import { INDIAN_STATES } from '@/lib/constants'
import type { Invoice, InvoiceItem } from '@/types/invoice'
import { Save, Send, ArrowLeft } from 'lucide-react'
import { addDays, format } from 'date-fns'

export function InvoiceBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addInvoice, updateInvoice, getInvoice } = useInvoiceStore()
  const { customers } = useCustomerStore()
  const { products } = useProductStore()
  const settings = useSettingsStore()
  const [saving, setSaving] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')
  const defaultDue = format(addDays(new Date(), settings.invoiceDefaults.defaultPaymentTerms), 'yyyy-MM-dd')

  const [form, setForm] = useState<Partial<Invoice>>({
    invoiceNumber: '',
    customerId: '',
    customerSnapshot: { name: '', billingAddress: { line1: '', line2: '', city: '', state: '', pincode: '', country: 'India' } },
    items: [],
    subtotal: 0,
    discount: 0,
    discountType: 'percentage',
    taxDetails: { cgst: 0, sgst: 0, igst: 0, cess: 0, totalTax: 0 },
    shippingCharges: 0,
    otherCharges: 0,
    otherChargesDescription: '',
    roundOff: 0,
    totalAmount: 0,
    amountInWords: '',
    status: 'draft',
    issueDate: today,
    dueDate: defaultDue,
    placeOfSupply: '',
    reverseCharge: false,
    notes: settings.invoiceDefaults.defaultNotes,
    terms: settings.invoiceDefaults.defaultTerms,
    templateId: 'classic',
    paidAmount: 0,
  })

  // Load existing invoice for edit mode
  useEffect(() => {
    if (id) {
      const existing = getInvoice(id)
      if (existing) setForm(existing)
    }
  }, [id, getInvoice])

  // Generate invoice number for new invoices
  useEffect(() => {
    if (!id && !form.invoiceNumber) {
      generateInvoiceNumber(settings.invoiceDefaults.prefix, settings.invoiceDefaults.nextNumber)
        .then(({ number }) => setForm((f) => ({ ...f, invoiceNumber: number })))
    }
  }, [id, form.invoiceNumber, settings.invoiceDefaults])

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return
    setForm((f) => ({
      ...f,
      customerId,
      customerSnapshot: {
        name: customer.name,
        businessName: customer.businessName,
        gstin: customer.gstin,
        phone: customer.phone,
        email: customer.email,
        billingAddress: customer.billingAddress,
      },
      placeOfSupply: customer.billingAddress.state || f.placeOfSupply,
    }))
  }

  // Recalculate taxes when items or states change
  const recalculate = useCallback(
    (items: InvoiceItem[], placeOfSupply?: string) => {
      const sellerState = settings.gst.sellerState
      const buyerState = placeOfSupply || form.placeOfSupply || ''
      const result = calculateInvoiceTax(items, sellerState, buyerState)

      const subtotal = result.subtotal
      const taxTotal = result.taxDetails.totalTax
      const shipping = form.shippingCharges || 0
      const other = form.otherCharges || 0
      const preRound = subtotal + taxTotal + shipping + other
      const roundOff = calculateRoundOff(preRound)
      const totalAmount = Math.round(preRound + roundOff)

      setForm((f) => ({
        ...f,
        items: result.items,
        subtotal,
        taxDetails: result.taxDetails,
        roundOff,
        totalAmount,
        amountInWords: numberToWords(totalAmount),
        ...(placeOfSupply ? { placeOfSupply } : {}),
      }))
    },
    [settings.gst.sellerState, form.placeOfSupply, form.shippingCharges, form.otherCharges]
  )

  const handleItemsChange = (items: InvoiceItem[]) => {
    recalculate(items)
  }

  const handleSave = async (status: 'draft' | 'sent' = 'draft') => {
    setSaving(true)
    try {
      const invoiceData = { ...form, status } as Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
      if (id) {
        await updateInvoice(id, invoiceData)
      } else {
        await addInvoice(invoiceData)
        await settings.incrementInvoiceNumber()
      }
      navigate('/invoices')
    } finally {
      setSaving(false)
    }
  }

  const isInterState = settings.gst.sellerState.toLowerCase() !== (form.placeOfSupply || '').toLowerCase()

  return (
    <div>
      <PageHeader
        title={id ? 'Edit Invoice' : 'New Invoice'}
        description={form.invoiceNumber ? `Invoice ${form.invoiceNumber}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave('sent')}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Save & Send
            </button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Header Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Invoice Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={form.invoiceNumber ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Place of Supply</label>
                  <select
                    value={form.placeOfSupply ?? ''}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, placeOfSupply: e.target.value }))
                      recalculate(form.items as InvoiceItem[], e.target.value)
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={form.issueDate ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
              {settings.gst.enableReverseCharge && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.reverseCharge ?? false}
                    onChange={(e) => setForm((f) => ({ ...f, reverseCharge: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600"
                  />
                  <span className="text-sm text-slate-700">Reverse Charge Applicable</span>
                </label>
              )}
            </div>

            {/* Customer */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Bill To</h3>
              <select
                value={form.customerId ?? ''}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}{c.businessName ? ` (${c.businessName})` : ''}</option>
                ))}
              </select>
              {form.customerSnapshot?.name && (
                <div className="rounded-lg bg-slate-50 p-3 space-y-1">
                  <p className="text-sm font-medium text-slate-900">{form.customerSnapshot.name}</p>
                  {form.customerSnapshot.businessName && (
                    <p className="text-xs text-slate-500">{form.customerSnapshot.businessName}</p>
                  )}
                  {form.customerSnapshot.gstin && (
                    <p className="text-xs text-slate-500 font-mono">GSTIN: {form.customerSnapshot.gstin}</p>
                  )}
                  {form.customerSnapshot.billingAddress.line1 && (
                    <p className="text-xs text-slate-500">
                      {form.customerSnapshot.billingAddress.line1}, {form.customerSnapshot.billingAddress.city}, {form.customerSnapshot.billingAddress.state}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <ItemsTable
          items={(form.items ?? []) as InvoiceItem[]}
          onChange={handleItemsChange}
          products={products}
        />

        {/* Summary & Extras */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Additional Fields */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Shipping Charges</label>
                <input
                  type="number"
                  value={form.shippingCharges || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0
                    setForm((f) => ({ ...f, shippingCharges: val }))
                    setTimeout(() => recalculate(form.items as InvoiceItem[]), 0)
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="0.00"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Other Charges</label>
                <input
                  type="number"
                  value={form.otherCharges || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0
                    setForm((f) => ({ ...f, otherCharges: val }))
                    setTimeout(() => recalculate(form.items as InvoiceItem[]), 0)
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="0.00"
                  min={0}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Notes</label>
              <textarea
                value={form.notes ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Additional notes..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Terms & Conditions</label>
              <textarea
                value={form.terms ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Terms and conditions..."
              />
            </div>
          </div>

          {/* Tax Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <TaxSummary
              subtotal={form.subtotal ?? 0}
              discount={form.discount ?? 0}
              taxDetails={form.taxDetails ?? { cgst: 0, sgst: 0, igst: 0, cess: 0, totalTax: 0 }}
              shippingCharges={form.shippingCharges ?? 0}
              otherCharges={form.otherCharges ?? 0}
              roundOff={form.roundOff ?? 0}
              totalAmount={form.totalAmount ?? 0}
              isInterState={isInterState}
            />
            {form.amountInWords && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Amount in Words</p>
                <p className="text-sm font-medium text-slate-900">{form.amountInWords}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

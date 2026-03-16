import { useState } from 'react'
import { useCustomerStore } from '@/stores/customerStore'
import { INDIAN_STATES } from '@/lib/constants'
import type { Customer } from '@/types/customer'
import { X, Save } from 'lucide-react'

interface CustomerFormProps {
  customer?: Customer
  open: boolean
  onClose: () => void
}

const emptyForm = {
  name: '',
  businessName: '',
  gstin: '',
  pan: '',
  phone: '',
  email: '',
  billingAddress: { line1: '', line2: '', city: '', state: '', pincode: '', country: 'India' },
  creditLimit: 0,
  paymentTerms: 30,
  notes: '',
}

export function CustomerForm({ customer, open, onClose }: CustomerFormProps) {
  const { addCustomer, updateCustomer } = useCustomerStore()
  const [form, setForm] = useState(customer ?? emptyForm)
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (customer) {
        await updateCustomer(customer.id, form)
      } else {
        await addCustomer(form as Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {customer ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Customer Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                value={form.businessName ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Business Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN</label>
              <input
                type="text"
                value={form.gstin ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PAN</label>
              <input
                type="text"
                value={form.pan ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, pan: e.target.value.toUpperCase() }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="customer@email.com"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-900 mb-3">Billing Address</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={form.billingAddress.line1}
                  onChange={(e) => setForm((f) => ({ ...f, billingAddress: { ...f.billingAddress, line1: e.target.value } }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="Address Line 1"
                />
              </div>
              <input
                type="text"
                value={form.billingAddress.city}
                onChange={(e) => setForm((f) => ({ ...f, billingAddress: { ...f.billingAddress, city: e.target.value } }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="City"
              />
              <select
                value={form.billingAddress.state}
                onChange={(e) => setForm((f) => ({ ...f, billingAddress: { ...f.billingAddress, state: e.target.value } }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <input
                type="text"
                value={form.billingAddress.pincode}
                onChange={(e) => setForm((f) => ({ ...f, billingAddress: { ...f.billingAddress, pincode: e.target.value } }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Pincode"
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={form.notes ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Additional notes..."
            />
          </div>

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
              {saving ? 'Saving...' : customer ? 'Update' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

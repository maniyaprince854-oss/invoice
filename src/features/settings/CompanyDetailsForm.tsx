import { useState, useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { INDIAN_STATES } from '@/lib/constants'
import { Save, Upload } from 'lucide-react'

export function CompanyDetailsForm() {
  const { company, updateCompany } = useSettingsStore()
  const [form, setForm] = useState(company)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm(company) }, [company])

  const handleSave = async () => {
    setSaving(true)
    await updateCompany(form)
    setSaving(false)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, logoUrl: reader.result as string }))
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Company Details</h3>
        <p className="text-sm text-slate-500 mt-1">This information will appear on your invoices</p>
      </div>

      {/* Logo */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Company Logo</label>
        <div className="flex items-center gap-4">
          {form.logoUrl ? (
            <img src={form.logoUrl} alt="Logo" className="h-16 w-16 rounded-lg border border-slate-200 object-contain" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <Upload className="h-5 w-5" />
            </div>
          )}
          <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Upload Logo
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="Your Business Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN</label>
          <input
            type="text"
            value={form.gstin}
            onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="22AAAAA0000A1Z5"
            maxLength={15}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="billing@company.com"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 mb-3">Business Address</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={form.address.line1}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, line1: e.target.value } }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Address Line 1"
            />
          </div>
          <input
            type="text"
            value={form.address.city}
            onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="City"
          />
          <select
            value={form.address.state}
            onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, state: e.target.value } }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <input
            type="text"
            value={form.address.pincode}
            onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, pincode: e.target.value } }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="Pincode"
            maxLength={6}
          />
        </div>
      </div>

      {/* Bank Details */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 mb-3">Bank Details</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={form.bankName ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="Bank Name"
          />
          <input
            type="text"
            value={form.bankAccountNumber ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, bankAccountNumber: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="Account Number"
          />
          <input
            type="text"
            value={form.bankIfsc ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, bankIfsc: e.target.value.toUpperCase() }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="IFSC Code"
          />
          <input
            type="text"
            value={form.bankBranch ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, bankBranch: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="Branch"
          />
          <input
            type="text"
            value={form.upiId ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, upiId: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="UPI ID (e.g. business@upi)"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

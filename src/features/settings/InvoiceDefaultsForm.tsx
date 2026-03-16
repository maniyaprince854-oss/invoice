import { useState, useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { Save } from 'lucide-react'

export function InvoiceDefaultsForm() {
  const { invoiceDefaults, updateInvoiceDefaults } = useSettingsStore()
  const [form, setForm] = useState(invoiceDefaults)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm(invoiceDefaults) }, [invoiceDefaults])

  const handleSave = async () => {
    setSaving(true)
    await updateInvoiceDefaults(form)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Invoice Defaults</h3>
        <p className="text-sm text-slate-500 mt-1">Set default values for new invoices</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Prefix</label>
          <input
            type="text"
            value={form.prefix}
            onChange={(e) => setForm((f) => ({ ...f, prefix: e.target.value.toUpperCase() }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="INV"
          />
          <p className="mt-1 text-xs text-slate-500">Preview: {form.prefix}-{String(form.nextNumber).padStart(4, '0')}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Next Invoice Number</label>
          <input
            type="number"
            value={form.nextNumber}
            onChange={(e) => setForm((f) => ({ ...f, nextNumber: parseInt(e.target.value) || 1 }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Payment Terms (days)</label>
          <input
            type="number"
            value={form.defaultPaymentTerms}
            onChange={(e) => setForm((f) => ({ ...f, defaultPaymentTerms: parseInt(e.target.value) || 0 }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Default Notes</label>
        <textarea
          value={form.defaultNotes}
          onChange={(e) => setForm((f) => ({ ...f, defaultNotes: e.target.value }))}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          placeholder="Notes that will appear on every invoice..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Default Terms & Conditions</label>
        <textarea
          value={form.defaultTerms}
          onChange={(e) => setForm((f) => ({ ...f, defaultTerms: e.target.value }))}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          placeholder="Terms and conditions for your invoices..."
        />
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

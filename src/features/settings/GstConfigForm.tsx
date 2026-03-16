import { useState, useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { INDIAN_STATES, TAX_SLABS } from '@/lib/constants'
import { Save } from 'lucide-react'

export function GstConfigForm() {
  const { gst, updateGST } = useSettingsStore()
  const [form, setForm] = useState(gst)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm(gst) }, [gst])

  const handleSave = async () => {
    setSaving(true)
    await updateGST(form)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">GST Configuration</h3>
        <p className="text-sm text-slate-500 mt-1">Configure your GST and tax settings</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Seller State *</label>
          <select
            value={form.sellerState}
            onChange={(e) => setForm((f) => ({ ...f, sellerState: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">Used to determine CGST/SGST vs IGST</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Tax Rate</label>
          <select
            value={form.defaultTaxRate}
            onChange={(e) => setForm((f) => ({ ...f, defaultTaxRate: Number(e.target.value) }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            {TAX_SLABS.map((rate) => (
              <option key={rate} value={rate}>{rate}%</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.enableCess}
            onChange={(e) => setForm((f) => ({ ...f, enableCess: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
          />
          <div>
            <span className="text-sm font-medium text-slate-700">Enable Cess</span>
            <p className="text-xs text-slate-500">Add cess tax to applicable items</p>
          </div>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.enableReverseCharge}
            onChange={(e) => setForm((f) => ({ ...f, enableReverseCharge: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
          />
          <div>
            <span className="text-sm font-medium text-slate-700">Enable Reverse Charge</span>
            <p className="text-xs text-slate-500">Support reverse charge mechanism on invoices</p>
          </div>
        </label>
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

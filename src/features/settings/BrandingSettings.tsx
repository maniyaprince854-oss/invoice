import { useState, useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { Save } from 'lucide-react'

export function BrandingSettings() {
  const { branding, updateBranding } = useSettingsStore()
  const [form, setForm] = useState(branding)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm(branding) }, [branding])

  const handleSave = async () => {
    setSaving(true)
    await updateBranding(form)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Branding</h3>
        <p className="text-sm text-slate-500 mt-1">Customize the look and feel of your invoices</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              className="h-10 w-10 cursor-pointer rounded border border-slate-200"
            />
            <input
              type="text"
              value={form.primaryColor}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Accent Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.accentColor}
              onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))}
              className="h-10 w-10 cursor-pointer rounded border border-slate-200"
            />
            <input
              type="text"
              value={form.accentColor}
              onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Logo Placement</label>
          <select
            value={form.logoPlacement}
            onChange={(e) => setForm((f) => ({ ...f, logoPlacement: e.target.value as 'left' | 'center' | 'right' }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.showBankDetails}
            onChange={(e) => setForm((f) => ({ ...f, showBankDetails: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
          />
          <span className="text-sm font-medium text-slate-700">Show bank details on invoice</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.showQrCode}
            onChange={(e) => setForm((f) => ({ ...f, showQrCode: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
          />
          <span className="text-sm font-medium text-slate-700">Show QR code for UPI payment</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.showSignature}
            onChange={(e) => setForm((f) => ({ ...f, showSignature: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
          />
          <span className="text-sm font-medium text-slate-700">Show signature on invoice</span>
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

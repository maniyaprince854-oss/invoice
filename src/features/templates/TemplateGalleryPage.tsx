import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { useSettingsStore } from '@/stores/settingsStore'
import { Check, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with clear sections and professional styling',
    preview: 'bg-gradient-to-b from-slate-100 to-white',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, minimalist design with accent colors and modern typography',
    preview: 'bg-gradient-to-br from-primary-50 to-white',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with maximum whitespace and focus on content',
    preview: 'bg-white',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Formal layout suitable for large businesses and corporations',
    preview: 'bg-gradient-to-b from-slate-800 to-slate-600',
  },
  {
    id: 'detailed',
    name: 'Detailed GST',
    description: 'Comprehensive GST invoice with detailed tax breakdowns per item',
    preview: 'bg-gradient-to-br from-blue-50 to-white',
  },
  {
    id: 'export',
    name: 'Export Invoice',
    description: 'Designed for international trade with additional export fields',
    preview: 'bg-gradient-to-br from-green-50 to-white',
  },
]

export function TemplateGalleryPage() {
  const branding = useSettingsStore((s) => s.branding)
  const updateBranding = useSettingsStore((s) => s.updateBranding)
  const [selectedTemplate, setSelectedTemplate] = useState('classic')

  return (
    <div>
      <PageHeader
        title="Invoice Templates"
        description="Choose a template for your invoices"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={cn(
              'group cursor-pointer rounded-xl border-2 p-1 transition-all',
              selectedTemplate === template.id
                ? 'border-primary-500 shadow-md shadow-primary-100'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            {/* Preview */}
            <div className={cn('relative h-48 rounded-lg', template.preview)}>
              {/* Fake invoice preview */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="h-2 w-20 rounded bg-slate-300/50" />
                    <div className="h-1.5 w-16 rounded bg-slate-200/50" />
                  </div>
                  <div className="h-6 w-16 rounded" style={{ backgroundColor: branding.primaryColor + '30' }} />
                </div>
                <div className="mt-4 space-y-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="h-1.5 flex-1 rounded bg-slate-200/60" />
                      <div className="h-1.5 w-8 rounded bg-slate-200/60" />
                      <div className="h-1.5 w-12 rounded bg-slate-200/60" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <div className="h-2 w-20 rounded" style={{ backgroundColor: branding.primaryColor + '40' }} />
                </div>
              </div>
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-sm font-semibold text-slate-900">{template.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Branding */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-primary-500" />
          <h3 className="text-sm font-semibold text-slate-900">Quick Branding</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded border border-slate-200"
              />
              <span className="text-xs font-mono text-slate-500">{branding.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Logo Position</label>
            <select
              value={branding.logoPlacement}
              onChange={(e) => updateBranding({ logoPlacement: e.target.value as 'left' | 'center' | 'right' })}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-primary-300 focus:outline-none"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={branding.showBankDetails}
                onChange={(e) => updateBranding({ showBankDetails: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary-600"
              />
              <span className="text-xs text-slate-700">Show Bank Details</span>
            </label>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={branding.showSignature}
                onChange={(e) => updateBranding({ showSignature: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary-600"
              />
              <span className="text-xs text-slate-700">Show Signature</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Building2, Receipt, Palette, Database } from 'lucide-react'
import { CompanyDetailsForm } from './CompanyDetailsForm'
import { GstConfigForm } from './GstConfigForm'
import { InvoiceDefaultsForm } from './InvoiceDefaultsForm'
import { BrandingSettings } from './BrandingSettings'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'company', label: 'Company Details', icon: Building2 },
  { id: 'gst', label: 'GST Configuration', icon: Receipt },
  { id: 'invoice', label: 'Invoice Defaults', icon: Database },
  { id: 'branding', label: 'Branding', icon: Palette },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your business settings and preferences"
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tab Navigation */}
        <div className="w-full lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            {activeTab === 'company' && <CompanyDetailsForm />}
            {activeTab === 'gst' && <GstConfigForm />}
            {activeTab === 'invoice' && <InvoiceDefaultsForm />}
            {activeTab === 'branding' && <BrandingSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}

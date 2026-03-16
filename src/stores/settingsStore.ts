import { create } from 'zustand'
import { db } from '@/db'
import type { AppSettings, CompanyDetails, GSTConfig, InvoiceDefaults, BrandingConfig } from '@/types/settings'

const DEFAULT_SETTINGS: AppSettings = {
  company: {
    name: '',
    address: { line1: '', line2: '', city: '', state: '', pincode: '', country: 'India' },
    gstin: '',
    phone: '',
    email: '',
  },
  gst: {
    defaultTaxRate: 18,
    sellerState: '',
    enableCess: false,
    enableReverseCharge: false,
  },
  invoiceDefaults: {
    prefix: 'INV',
    nextNumber: 1,
    defaultPaymentTerms: 30,
    defaultNotes: '',
    defaultTerms: 'Thank you for your business.',
  },
  branding: {
    primaryColor: '#4f46e5',
    accentColor: '#6366f1',
    fontFamily: 'Inter',
    logoPlacement: 'left',
    showQrCode: true,
    showBankDetails: true,
    showSignature: true,
  },
}

interface SettingsState extends AppSettings {
  loaded: boolean
  loadSettings: () => Promise<void>
  updateCompany: (company: Partial<CompanyDetails>) => Promise<void>
  updateGST: (gst: Partial<GSTConfig>) => Promise<void>
  updateInvoiceDefaults: (defaults: Partial<InvoiceDefaults>) => Promise<void>
  updateBranding: (branding: Partial<BrandingConfig>) => Promise<void>
  incrementInvoiceNumber: () => Promise<number>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  loaded: false,

  loadSettings: async () => {
    const records = await db.settings.toArray()
    const settings: Partial<AppSettings> = {}
    for (const record of records) {
      if (record.key === 'company') settings.company = record.value as CompanyDetails
      if (record.key === 'gst') settings.gst = record.value as GSTConfig
      if (record.key === 'invoiceDefaults') settings.invoiceDefaults = record.value as InvoiceDefaults
      if (record.key === 'branding') settings.branding = record.value as BrandingConfig
    }
    set({ ...DEFAULT_SETTINGS, ...settings, loaded: true })
  },

  updateCompany: async (updates) => {
    const company = { ...get().company, ...updates }
    await db.settings.put({ id: 'company', key: 'company', value: company })
    set({ company })
  },

  updateGST: async (updates) => {
    const gst = { ...get().gst, ...updates }
    await db.settings.put({ id: 'gst', key: 'gst', value: gst })
    set({ gst })
  },

  updateInvoiceDefaults: async (updates) => {
    const invoiceDefaults = { ...get().invoiceDefaults, ...updates }
    await db.settings.put({ id: 'invoiceDefaults', key: 'invoiceDefaults', value: invoiceDefaults })
    set({ invoiceDefaults })
  },

  updateBranding: async (updates) => {
    const branding = { ...get().branding, ...updates }
    await db.settings.put({ id: 'branding', key: 'branding', value: branding })
    set({ branding })
  },

  incrementInvoiceNumber: async () => {
    const current = get().invoiceDefaults.nextNumber
    await get().updateInvoiceDefaults({ nextNumber: current + 1 })
    return current
  },
}))

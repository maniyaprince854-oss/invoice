import type { Address } from './common'

export interface CompanyDetails {
  name: string
  address: Address
  gstin: string
  phone: string
  email: string
  logoUrl?: string
  bankName?: string
  bankAccountNumber?: string
  bankIfsc?: string
  bankBranch?: string
  upiId?: string
  qrCodeUrl?: string
}

export interface GSTConfig {
  defaultTaxRate: number
  sellerState: string
  enableCess: boolean
  enableReverseCharge: boolean
}

export interface InvoiceDefaults {
  prefix: string
  nextNumber: number
  defaultPaymentTerms: number
  defaultNotes: string
  defaultTerms: string
}

export interface BrandingConfig {
  primaryColor: string
  accentColor: string
  fontFamily: string
  logoPlacement: 'left' | 'center' | 'right'
  showQrCode: boolean
  showBankDetails: boolean
  showSignature: boolean
}

export interface AppSettings {
  company: CompanyDetails
  gst: GSTConfig
  invoiceDefaults: InvoiceDefaults
  branding: BrandingConfig
}

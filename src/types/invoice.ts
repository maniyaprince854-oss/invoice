import type { ID, Address, Timestamps } from './common'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled'

export interface InvoiceItem {
  id: ID
  productId?: ID
  name: string
  description?: string
  hsnCode?: string
  quantity: number
  unit: string
  rate: number
  discount: number
  discountType: 'percentage' | 'fixed'
  taxRate: number
  cessRate: number
  cgst: number
  sgst: number
  igst: number
  cess: number
  amount: number
}

export interface TaxDetails {
  cgst: number
  sgst: number
  igst: number
  cess: number
  totalTax: number
}

export interface CustomerSnapshot {
  name: string
  businessName?: string
  gstin?: string
  phone?: string
  email?: string
  billingAddress: Address
}

export interface Invoice extends Timestamps {
  id: ID
  invoiceNumber: string
  customerId?: ID
  customerSnapshot: CustomerSnapshot
  items: InvoiceItem[]
  subtotal: number
  discount: number
  discountType: 'percentage' | 'fixed'
  taxDetails: TaxDetails
  shippingCharges: number
  otherCharges: number
  otherChargesDescription?: string
  roundOff: number
  totalAmount: number
  amountInWords: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  placeOfSupply: string
  reverseCharge: boolean
  notes?: string
  terms?: string
  signatureUrl?: string
  stampUrl?: string
  templateId: string
  paidAmount: number
}

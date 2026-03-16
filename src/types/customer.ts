import type { ID, Address, Timestamps } from './common'

export interface Customer extends Timestamps {
  id: ID
  name: string
  businessName?: string
  gstin?: string
  pan?: string
  phone?: string
  email?: string
  billingAddress: Address
  shippingAddress?: Address
  creditLimit?: number
  paymentTerms?: number
  notes?: string
  tags?: string[]
}

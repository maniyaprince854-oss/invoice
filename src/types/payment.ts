import type { ID, Timestamps } from './common'

export type PaymentMethod = 'bank_transfer' | 'upi' | 'cash' | 'card' | 'cheque' | 'other'

export interface Payment extends Omit<Timestamps, 'updatedAt'> {
  id: ID
  invoiceId: ID
  amount: number
  method: PaymentMethod
  reference?: string
  date: string
  notes?: string
}

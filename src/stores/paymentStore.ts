import { create } from 'zustand'
import { db } from '@/db'
import type { Payment } from '@/types/payment'
import { v4 as uuid } from 'uuid'

interface PaymentState {
  payments: Payment[]
  loading: boolean
  fetchPayments: () => Promise<void>
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Promise<Payment>
  deletePayment: (id: string) => Promise<void>
  getPaymentsByInvoice: (invoiceId: string) => Payment[]
  getTotalPaidForInvoice: (invoiceId: string) => number
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  loading: false,

  fetchPayments: async () => {
    set({ loading: true })
    const payments = await db.payments.orderBy('date').reverse().toArray()
    set({ payments, loading: false })
  },

  addPayment: async (data) => {
    const payment: Payment = {
      ...data,
      id: uuid(),
      createdAt: new Date().toISOString(),
    }
    await db.payments.add(payment)
    set((s) => ({ payments: [payment, ...s.payments] }))
    return payment
  },

  deletePayment: async (id) => {
    await db.payments.delete(id)
    set((s) => ({ payments: s.payments.filter((p) => p.id !== id) }))
  },

  getPaymentsByInvoice: (invoiceId) =>
    get().payments.filter((p) => p.invoiceId === invoiceId),

  getTotalPaidForInvoice: (invoiceId) =>
    get()
      .payments.filter((p) => p.invoiceId === invoiceId)
      .reduce((sum, p) => sum + p.amount, 0),
}))

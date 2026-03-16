import { create } from 'zustand'
import { db } from '@/db'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import { v4 as uuid } from 'uuid'

interface InvoiceFilters {
  status?: InvoiceStatus
  customerId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

interface InvoiceState {
  invoices: Invoice[]
  loading: boolean
  filters: InvoiceFilters
  fetchInvoices: () => Promise<void>
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  updateStatus: (id: string, status: InvoiceStatus) => Promise<void>
  getInvoice: (id: string) => Invoice | undefined
  setFilters: (filters: InvoiceFilters) => void
  getFilteredInvoices: () => Invoice[]
  duplicateInvoice: (id: string) => Promise<Invoice | null>
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  loading: false,
  filters: {},

  fetchInvoices: async () => {
    set({ loading: true })
    const invoices = await db.invoices.orderBy('issueDate').reverse().toArray()
    set({ invoices, loading: false })
  },

  addInvoice: async (data) => {
    const now = new Date().toISOString()
    const invoice: Invoice = {
      ...data,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    }
    await db.invoices.add(invoice)
    set((s) => ({ invoices: [invoice, ...s.invoices] }))
    return invoice
  },

  updateInvoice: async (id, updates) => {
    const updated = { ...updates, updatedAt: new Date().toISOString() }
    await db.invoices.update(id, updated)
    set((s) => ({
      invoices: s.invoices.map((inv) => (inv.id === id ? { ...inv, ...updated } : inv)),
    }))
  },

  deleteInvoice: async (id) => {
    await db.invoices.delete(id)
    set((s) => ({ invoices: s.invoices.filter((inv) => inv.id !== id) }))
  },

  updateStatus: async (id, status) => {
    await get().updateInvoice(id, { status })
  },

  getInvoice: (id) => get().invoices.find((inv) => inv.id === id),

  setFilters: (filters) => set({ filters }),

  getFilteredInvoices: () => {
    const { invoices, filters } = get()
    return invoices.filter((inv) => {
      if (filters.status && inv.status !== filters.status) return false
      if (filters.customerId && inv.customerId !== filters.customerId) return false
      if (filters.dateFrom && inv.issueDate < filters.dateFrom) return false
      if (filters.dateTo && inv.issueDate > filters.dateTo) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        return (
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.customerSnapshot.name.toLowerCase().includes(q)
        )
      }
      return true
    })
  },

  duplicateInvoice: async (id) => {
    const original = get().getInvoice(id)
    if (!original) return null
    const { id: _id, invoiceNumber: _num, createdAt: _c, updatedAt: _u, ...rest } = original
    return get().addInvoice({
      ...rest,
      status: 'draft',
      paidAmount: 0,
      issueDate: new Date().toISOString().split('T')[0]!,
      invoiceNumber: '',
    })
  },
}))

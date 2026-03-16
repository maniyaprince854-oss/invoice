import { create } from 'zustand'
import { db } from '@/db'
import type { Customer } from '@/types/customer'
import { v4 as uuid } from 'uuid'

interface CustomerState {
  customers: Customer[]
  loading: boolean
  fetchCustomers: () => Promise<void>
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Customer>
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
  getCustomer: (id: string) => Customer | undefined
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  loading: false,

  fetchCustomers: async () => {
    set({ loading: true })
    const customers = await db.customers.orderBy('name').toArray()
    set({ customers, loading: false })
  },

  addCustomer: async (data) => {
    const now = new Date().toISOString()
    const customer: Customer = {
      ...data,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    }
    await db.customers.add(customer)
    set((s) => ({ customers: [...s.customers, customer] }))
    return customer
  },

  updateCustomer: async (id, updates) => {
    const updated = { ...updates, updatedAt: new Date().toISOString() }
    await db.customers.update(id, updated)
    set((s) => ({
      customers: s.customers.map((c) => (c.id === id ? { ...c, ...updated } : c)),
    }))
  },

  deleteCustomer: async (id) => {
    await db.customers.delete(id)
    set((s) => ({ customers: s.customers.filter((c) => c.id !== id) }))
  },

  getCustomer: (id) => get().customers.find((c) => c.id === id),
}))

import Dexie, { type EntityTable } from 'dexie'
import type { Customer } from '@/types/customer'
import type { Product } from '@/types/product'
import type { Invoice } from '@/types/invoice'
import type { Payment } from '@/types/payment'

interface SettingsRecord {
  id: string
  key: string
  value: unknown
}

class SmartInvoiceDB extends Dexie {
  invoices!: EntityTable<Invoice, 'id'>
  customers!: EntityTable<Customer, 'id'>
  products!: EntityTable<Product, 'id'>
  payments!: EntityTable<Payment, 'id'>
  settings!: EntityTable<SettingsRecord, 'id'>

  constructor() {
    super('SmartInvoiceDB')
    this.version(1).stores({
      invoices: 'id, invoiceNumber, customerId, status, issueDate, dueDate, [status+dueDate]',
      customers: 'id, name, email, gstin, phone, &gstin',
      products: 'id, name, hsnCode, category',
      payments: 'id, invoiceId, date, method',
      settings: 'id, key',
    })
  }
}

export const db = new SmartInvoiceDB()

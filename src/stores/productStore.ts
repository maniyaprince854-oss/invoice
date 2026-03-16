import { create } from 'zustand'
import { db } from '@/db'
import type { Product } from '@/types/product'
import { v4 as uuid } from 'uuid'

interface ProductState {
  products: Product[]
  loading: boolean
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProduct: (id: string) => Product | undefined
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true })
    const products = await db.products.orderBy('name').toArray()
    set({ products, loading: false })
  },

  addProduct: async (data) => {
    const now = new Date().toISOString()
    const product: Product = {
      ...data,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    }
    await db.products.add(product)
    set((s) => ({ products: [...s.products, product] }))
    return product
  },

  updateProduct: async (id, updates) => {
    const updated = { ...updates, updatedAt: new Date().toISOString() }
    await db.products.update(id, updated)
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }))
  },

  deleteProduct: async (id) => {
    await db.products.delete(id)
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
  },

  getProduct: (id) => get().products.find((p) => p.id === id),
}))

import type { ID, Timestamps } from './common'

export interface Product extends Timestamps {
  id: ID
  name: string
  description?: string
  sku?: string
  hsnCode?: string
  sacCode?: string
  category?: string
  unit: string
  defaultPrice: number
  taxRate: number
  cessRate?: number
  isService: boolean
}

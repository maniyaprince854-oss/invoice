import type { ID } from './common'

export type TemplateLayout = 'classic' | 'modern' | 'minimal'

export interface InvoiceTemplate {
  id: ID
  name: string
  layout: TemplateLayout
  isDefault: boolean
  description?: string
}

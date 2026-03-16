export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const

export const UNION_TERRITORIES = [
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const

export const TAX_SLABS = [0, 0.25, 3, 5, 12, 18, 28] as const

export const UNITS = [
  'pcs', 'nos', 'kg', 'g', 'mg', 'ltr', 'ml', 'mtr', 'cm', 'mm',
  'ft', 'inch', 'sqft', 'sqm', 'box', 'bag', 'pair', 'set', 'roll',
  'bundle', 'dozen', 'hour', 'day', 'month', 'year', 'ton', 'quintal',
] as const

export const PAYMENT_METHODS = [
  'bank_transfer', 'upi', 'cash', 'card', 'cheque', 'other',
] as const

export const INVOICE_STATUSES = [
  'draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled',
] as const

export const DEFAULT_INVOICE_PREFIX = 'INV'
export const DEFAULT_CURRENCY = 'INR'
export const CURRENCY_SYMBOL = '₹'

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  draft: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
  sent: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-400' },
  paid: { bg: 'bg-success-50', text: 'text-success-600', dot: 'bg-success-500' },
  partial: { bg: 'bg-warning-50', text: 'text-warning-600', dot: 'bg-warning-500' },
  overdue: { bg: 'bg-danger-50', text: 'text-danger-600', dot: 'bg-danger-500' },
  cancelled: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
}

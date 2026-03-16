import type { InvoiceItem, TaxDetails } from '@/types/invoice'

export interface TaxCalculationInput {
  sellerState: string
  buyerState: string
  items: Array<{
    quantity: number
    rate: number
    discount: number
    discountType: 'percentage' | 'fixed'
    taxRate: number
    cessRate: number
  }>
}

export interface ItemTaxResult {
  taxableAmount: number
  cgst: number
  sgst: number
  igst: number
  cess: number
  totalTax: number
  amount: number
}

export function calculateItemTax(
  item: { quantity: number; rate: number; discount: number; discountType: 'percentage' | 'fixed'; taxRate: number; cessRate: number },
  isInterState: boolean
): ItemTaxResult {
  const gross = item.quantity * item.rate
  const discountAmount = item.discountType === 'percentage'
    ? (gross * item.discount) / 100
    : item.discount
  const taxableAmount = gross - discountAmount

  let cgst = 0
  let sgst = 0
  let igst = 0

  if (isInterState) {
    igst = (taxableAmount * item.taxRate) / 100
  } else {
    cgst = (taxableAmount * item.taxRate) / 200
    sgst = (taxableAmount * item.taxRate) / 200
  }

  const cess = item.cessRate ? (taxableAmount * item.cessRate) / 100 : 0
  const totalTax = cgst + sgst + igst + cess
  const amount = taxableAmount + totalTax

  return {
    taxableAmount: round2(taxableAmount),
    cgst: round2(cgst),
    sgst: round2(sgst),
    igst: round2(igst),
    cess: round2(cess),
    totalTax: round2(totalTax),
    amount: round2(amount),
  }
}

export function calculateInvoiceTax(
  items: InvoiceItem[],
  sellerState: string,
  buyerState: string
): { items: InvoiceItem[]; taxDetails: TaxDetails; subtotal: number } {
  const isInterState = sellerState.toLowerCase() !== buyerState.toLowerCase()
  let totalCgst = 0
  let totalSgst = 0
  let totalIgst = 0
  let totalCess = 0
  let subtotal = 0

  const calculatedItems = items.map((item) => {
    const result = calculateItemTax(item, isInterState)
    totalCgst += result.cgst
    totalSgst += result.sgst
    totalIgst += result.igst
    totalCess += result.cess
    subtotal += result.taxableAmount

    return {
      ...item,
      cgst: result.cgst,
      sgst: result.sgst,
      igst: result.igst,
      cess: result.cess,
      amount: result.amount,
    }
  })

  return {
    items: calculatedItems,
    taxDetails: {
      cgst: round2(totalCgst),
      sgst: round2(totalSgst),
      igst: round2(totalIgst),
      cess: round2(totalCess),
      totalTax: round2(totalCgst + totalSgst + totalIgst + totalCess),
    },
    subtotal: round2(subtotal),
  }
}

export function calculateRoundOff(amount: number): number {
  return round2(Math.round(amount) - amount)
}

function round2(num: number): number {
  return Math.round(num * 100) / 100
}

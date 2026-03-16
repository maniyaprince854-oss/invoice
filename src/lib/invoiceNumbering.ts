import { db } from '@/db'

export async function generateInvoiceNumber(prefix: string, nextNumber: number): Promise<{ number: string; next: number }> {
  const lastInvoice = await db.invoices.orderBy('invoiceNumber').last()

  let currentNum = nextNumber

  if (lastInvoice) {
    const match = lastInvoice.invoiceNumber.match(/(\d+)$/)
    if (match) {
      const lastNum = parseInt(match[1]!, 10)
      if (lastNum >= currentNum) {
        currentNum = lastNum + 1
      }
    }
  }

  const padded = String(currentNum).padStart(4, '0')
  return {
    number: `${prefix}-${padded}`,
    next: currentNum + 1,
  }
}

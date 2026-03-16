import type { Invoice } from '@/types/invoice'
import * as XLSX from 'xlsx'

export function exportToJson(invoices: Invoice[]): string {
  return JSON.stringify(invoices, null, 2)
}

export function exportToCsv(invoices: Invoice[]): string {
  if (invoices.length === 0) return ''

  const headers = [
    'Invoice Number', 'Date', 'Due Date', 'Customer', 'GSTIN',
    'Subtotal', 'CGST', 'SGST', 'IGST', 'Total', 'Status', 'Paid Amount',
  ]

  const rows = invoices.map((inv) => [
    inv.invoiceNumber,
    inv.issueDate,
    inv.dueDate,
    inv.customerSnapshot.name,
    inv.customerSnapshot.gstin || '',
    inv.subtotal,
    inv.taxDetails.cgst,
    inv.taxDetails.sgst,
    inv.taxDetails.igst,
    inv.totalAmount,
    inv.status,
    inv.paidAmount,
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}

export function exportToExcel(invoices: Invoice[], filename: string): void {
  const data = invoices.map((inv) => ({
    'Invoice Number': inv.invoiceNumber,
    'Date': inv.issueDate,
    'Due Date': inv.dueDate,
    'Customer': inv.customerSnapshot.name,
    'GSTIN': inv.customerSnapshot.gstin || '',
    'Subtotal': inv.subtotal,
    'CGST': inv.taxDetails.cgst,
    'SGST': inv.taxDetails.sgst,
    'IGST': inv.taxDetails.igst,
    'Cess': inv.taxDetails.cess,
    'Total Tax': inv.taxDetails.totalTax,
    'Shipping': inv.shippingCharges,
    'Other Charges': inv.otherCharges,
    'Round Off': inv.roundOff,
    'Total Amount': inv.totalAmount,
    'Status': inv.status,
    'Paid Amount': inv.paidAmount,
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

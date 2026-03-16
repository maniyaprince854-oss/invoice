import { formatCurrency } from '@/lib/formatters'
import type { TaxDetails } from '@/types/invoice'

interface TaxSummaryProps {
  subtotal: number
  discount: number
  taxDetails: TaxDetails
  shippingCharges: number
  otherCharges: number
  roundOff: number
  totalAmount: number
  isInterState: boolean
}

export function TaxSummary({
  subtotal,
  discount,
  taxDetails,
  shippingCharges,
  otherCharges,
  roundOff,
  totalAmount,
  isInterState,
}: TaxSummaryProps) {
  return (
    <div className="w-full max-w-sm ml-auto space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-500">Subtotal</span>
        <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Discount</span>
          <span className="font-medium text-danger-600">-{formatCurrency(discount)}</span>
        </div>
      )}

      {isInterState ? (
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">IGST</span>
          <span className="font-medium text-slate-900">{formatCurrency(taxDetails.igst)}</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">CGST</span>
            <span className="font-medium text-slate-900">{formatCurrency(taxDetails.cgst)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">SGST</span>
            <span className="font-medium text-slate-900">{formatCurrency(taxDetails.sgst)}</span>
          </div>
        </>
      )}

      {taxDetails.cess > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Cess</span>
          <span className="font-medium text-slate-900">{formatCurrency(taxDetails.cess)}</span>
        </div>
      )}

      {shippingCharges > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Shipping</span>
          <span className="font-medium text-slate-900">{formatCurrency(shippingCharges)}</span>
        </div>
      )}

      {otherCharges > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Other Charges</span>
          <span className="font-medium text-slate-900">{formatCurrency(otherCharges)}</span>
        </div>
      )}

      {roundOff !== 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Round Off</span>
          <span className="font-medium text-slate-900">{formatCurrency(roundOff)}</span>
        </div>
      )}

      <div className="border-t border-slate-200 pt-2">
        <div className="flex justify-between">
          <span className="text-base font-semibold text-slate-900">Total</span>
          <span className="text-lg font-bold text-slate-900">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}

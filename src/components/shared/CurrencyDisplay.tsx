import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface CurrencyDisplayProps {
  amount: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CurrencyDisplay({ amount, className, size = 'md' }: CurrencyDisplayProps) {
  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg font-semibold',
        amount < 0 && 'text-danger-600',
        className
      )}
    >
      {formatCurrency(amount)}
    </span>
  )
}

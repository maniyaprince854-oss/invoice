import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return '—'
  return format(d, 'dd MMM yyyy')
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return '—'
  return format(d, 'dd/MM/yyyy')
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return '—'
  return formatDistanceToNow(d, { addSuffix: true })
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero'

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function convertGroup(n: number): string {
    if (n === 0) return ''
    if (n < 20) return ones[n]!
    if (n < 100) return tens[Math.floor(n / 10)]! + (n % 10 ? ' ' + ones[n % 10]! : '')
    return ones[Math.floor(n / 100)]! + ' Hundred' + (n % 100 ? ' and ' + convertGroup(n % 100) : '')
  }

  const intPart = Math.floor(Math.abs(num))
  const decimal = Math.round((Math.abs(num) - intPart) * 100)

  let result = ''
  if (intPart >= 10000000) {
    result += convertGroup(Math.floor(intPart / 10000000)) + ' Crore '
  }
  if (intPart >= 100000) {
    result += convertGroup(Math.floor((intPart % 10000000) / 100000)) + ' Lakh '
  }
  if (intPart >= 1000) {
    result += convertGroup(Math.floor((intPart % 100000) / 1000)) + ' Thousand '
  }
  result += convertGroup(intPart % 1000)

  result = result.trim()
  if (!result) result = 'Zero'

  if (decimal > 0) {
    result += ' and ' + convertGroup(decimal) + ' Paise'
  }

  return result + ' Rupees Only'
}

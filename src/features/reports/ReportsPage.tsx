import { useMemo, useState } from 'react'
import { useInvoiceStore } from '@/stores/invoiceStore'
// Payment data available via usePaymentStore if needed
import { PageHeader } from '@/components/shared/PageHeader'
import { formatCurrency } from '@/lib/formatters'
import { Download } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'
import { exportToCsv, exportToExcel, downloadFile } from '@/lib/exportHelpers'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function ReportsPage() {
  const { invoices } = useInvoiceStore()
  const [activeTab, setActiveTab] = useState<'revenue' | 'tax' | 'invoices'>('revenue')

  // Monthly revenue
  const monthlyRevenue = useMemo(() => {
    const months = []
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const monthInvoices = invoices.filter((inv) => {
        try {
          return isWithinInterval(parseISO(inv.issueDate), { start, end })
        } catch { return false }
      })
      months.push({
        month: format(monthDate, 'MMM yy'),
        revenue: monthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
        collected: monthInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
      })
    }
    return months
  }, [invoices])

  // Tax summary
  const taxSummary = useMemo(() => {
    const totals = { cgst: 0, sgst: 0, igst: 0, cess: 0 }
    invoices.forEach((inv) => {
      totals.cgst += inv.taxDetails.cgst
      totals.sgst += inv.taxDetails.sgst
      totals.igst += inv.taxDetails.igst
      totals.cess += inv.taxDetails.cess
    })
    return [
      { name: 'CGST', value: totals.cgst },
      { name: 'SGST', value: totals.sgst },
      { name: 'IGST', value: totals.igst },
      { name: 'Cess', value: totals.cess },
    ].filter((t) => t.value > 0)
  }, [invoices])

  // Invoice status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    invoices.forEach((inv) => { counts[inv.status] = (counts[inv.status] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [invoices])

  const totalTax = taxSummary.reduce((sum, t) => sum + t.value, 0)

  const handleExportCsv = () => {
    const csv = exportToCsv(invoices)
    downloadFile(csv, 'invoices-report.csv', 'text/csv')
  }

  const handleExportExcel = () => {
    exportToExcel(invoices, 'invoices-report')
  }

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Business insights and financial reports"
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Excel
            </button>
          </div>
        }
      />

      {/* Report Tabs */}
      <div className="flex gap-1 mb-6 rounded-lg bg-slate-100 p-1 w-fit">
        {(['revenue', 'tax', 'invoices'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'tax' ? 'GST / Tax' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {formatCurrency(invoices.reduce((s, i) => s + i.totalAmount, 0))}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">Collected</p>
              <p className="mt-1 text-2xl font-bold text-success-600">
                {formatCurrency(invoices.reduce((s, i) => s + i.paidAmount, 0))}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">Outstanding</p>
              <p className="mt-1 text-2xl font-bold text-warning-600">
                {formatCurrency(invoices.reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0))}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {taxSummary.map((tax) => (
              <div key={tax.name} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-medium text-slate-500">{tax.name}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(tax.value)}</p>
              </div>
            ))}
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
              <p className="text-xs font-medium text-primary-600">Total Tax Collected</p>
              <p className="mt-1 text-2xl font-bold text-primary-700">{formatCurrency(totalTax)}</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Tax Distribution</h3>
            {taxSummary.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={taxSummary} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}>
                    {taxSummary.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-slate-400">No tax data yet</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Invoice Status Distribution</h3>
              {statusCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {statusCounts.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-sm text-slate-400">No data yet</div>
              )}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Invoice Summary</h3>
              <div className="space-y-3">
                {statusCounts.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-slate-600">{s.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{s.value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Total</span>
                  <span className="text-sm font-bold text-slate-900">{invoices.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

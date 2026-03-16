import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { useCustomerStore } from '@/stores/customerStore'
import { usePaymentStore } from '@/stores/paymentStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay'
import { PageHeader } from '@/components/shared/PageHeader'
import {
  Plus, FileText, Users, TrendingUp, Clock,
  IndianRupee, ArrowUpRight, BarChart3,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#94a3b8']

export function DashboardPage() {
  const navigate = useNavigate()
  const { invoices } = useInvoiceStore()
  const { customers } = useCustomerStore()
  const { payments } = usePaymentStore()

  const stats = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
    const outstanding = totalRevenue - totalPaid
    const overdue = invoices.filter(
      (inv) => inv.status !== 'paid' && inv.status !== 'cancelled' && inv.dueDate < new Date().toISOString().split('T')[0]!
    )

    return {
      totalRevenue,
      outstanding,
      totalInvoices: invoices.length,
      totalCustomers: customers.length,
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0),
    }
  }, [invoices, customers])

  // Monthly revenue data for chart
  const monthlyData = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const monthInvoices = invoices.filter((inv) => {
        try {
          const d = parseISO(inv.issueDate)
          return isWithinInterval(d, { start, end })
        } catch { return false }
      })
      const revenue = monthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
      const paid = monthInvoices.filter((inv) => inv.status === 'paid').length
      const unpaid = monthInvoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'cancelled').length

      months.push({
        month: format(monthDate, 'MMM'),
        revenue,
        paid,
        unpaid,
      })
    }
    return months
  }, [invoices])

  // Status distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {}
    invoices.forEach((inv) => {
      counts[inv.status] = (counts[inv.status] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [invoices])

  const recentInvoices = invoices.slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your business"
        actions={
          <button
            onClick={() => navigate('/invoices/new')}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total Revenue</p>
            <div className="rounded-lg bg-success-50 p-2 text-success-600">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-success-600">
            <ArrowUpRight className="h-3 w-3" />
            {stats.totalInvoices} invoices
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Outstanding</p>
            <div className="rounded-lg bg-warning-50 p-2 text-warning-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(stats.outstanding)}</p>
          <p className="mt-1 text-xs text-warning-600">
            {stats.overdueCount} overdue
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Invoices</p>
            <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalInvoices}</p>
          <p className="mt-1 text-xs text-slate-500">{payments.length} payments</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Customers</p>
            <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalCustomers}</p>
          <p className="mt-1 text-xs text-slate-500">active clients</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Revenue Overview</h3>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} labelStyle={{ color: '#475569' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Invoice Status</h3>
            <BarChart3 className="h-4 w-4 text-slate-400" />
          </div>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">No data yet</div>
          )}
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            {statusData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="capitalize text-slate-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Invoices</h3>
            <button
              onClick={() => navigate('/invoices')}
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          </div>
          {recentInvoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No invoices yet</p>
          ) : (
            <div className="space-y-2">
              {recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{inv.invoiceNumber}</p>
                      <p className="text-xs text-slate-500">{inv.customerSnapshot.name} &middot; {formatDate(inv.issueDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CurrencyDisplay amount={inv.totalAmount} size="sm" />
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/invoices/new')}
              className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-4 w-4 text-primary-500" />
              Create Invoice
            </button>
            <button
              onClick={() => navigate('/customers')}
              className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Users className="h-4 w-4 text-primary-500" />
              Add Customer
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-primary-500" />
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

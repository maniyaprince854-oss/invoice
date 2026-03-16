import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomerStore } from '@/stores/customerStore'
import { PageHeader } from '@/components/shared/PageHeader'
import { SearchInput } from '@/components/shared/SearchInput'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { CustomerForm } from './components/CustomerForm'
import { Plus, Users, Pencil, Trash2, Eye } from 'lucide-react'
import type { Customer } from '@/types/customer'

export function CustomerListPage() {
  const { customers, deleteCustomer } = useCustomerStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editCustomer, setEditCustomer] = useState<Customer | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.businessName?.toLowerCase().includes(q) ||
        c.gstin?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
    )
  }, [customers, search])

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${customers.length} total customers`}
        actions={
          <button
            onClick={() => { setEditCustomer(undefined); setShowForm(true) }}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search customers..." className="max-w-sm" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title={search ? 'No customers found' : 'No customers yet'}
          description={search ? 'Try adjusting your search' : 'Add your first customer to get started'}
          action={
            !search && (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Add Customer
              </button>
            )
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 hidden sm:table-cell">GSTIN</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 hidden md:table-cell">State</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 hidden lg:table-cell">Phone</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                      {customer.businessName && (
                        <p className="text-xs text-slate-500">{customer.businessName}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono hidden sm:table-cell">
                    {customer.gstin || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 hidden md:table-cell">
                    {customer.billingAddress.state || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 hidden lg:table-cell">
                    {customer.phone || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/customers/${customer.id}`)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setEditCustomer(customer); setShowForm(true) }}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(customer.id)}
                        className="rounded p-1.5 text-slate-400 hover:bg-danger-50 hover:text-danger-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CustomerForm
        open={showForm}
        customer={editCustomer}
        onClose={() => { setShowForm(false); setEditCustomer(undefined) }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) await deleteCustomer(deleteId) }}
        title="Delete Customer"
        description="This will permanently delete this customer. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

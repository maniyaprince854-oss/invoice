import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { InvoiceListPage } from '@/features/invoices/InvoiceListPage'
import { InvoiceBuilderPage } from '@/features/invoices/InvoiceBuilderPage'
import { InvoicePreviewPage } from '@/features/invoices/InvoicePreviewPage'
import { CustomerListPage } from '@/features/customers/CustomerListPage'
import { CustomerDetailPage } from '@/features/customers/CustomerDetailPage'
import { ProductListPage } from '@/features/products/ProductListPage'
import { PaymentListPage } from '@/features/payments/PaymentListPage'
import { ReportsPage } from '@/features/reports/ReportsPage'
import { TemplateGalleryPage } from '@/features/templates/TemplateGalleryPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { GlobalSearchDialog } from '@/features/search/GlobalSearchDialog'
import { useSettingsStore } from '@/stores/settingsStore'
import { useCustomerStore } from '@/stores/customerStore'
import { useProductStore } from '@/stores/productStore'
import { useInvoiceStore } from '@/stores/invoiceStore'
import { usePaymentStore } from '@/stores/paymentStore'

export function App() {
  const loadSettings = useSettingsStore((s) => s.loadSettings)
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers)
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const fetchInvoices = useInvoiceStore((s) => s.fetchInvoices)
  const fetchPayments = usePaymentStore((s) => s.fetchPayments)

  useEffect(() => {
    loadSettings()
    fetchCustomers()
    fetchProducts()
    fetchInvoices()
    fetchPayments()
  }, [loadSettings, fetchCustomers, fetchProducts, fetchInvoices, fetchPayments])

  return (
    <BrowserRouter>
      <GlobalSearchDialog />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/invoices" element={<InvoiceListPage />} />
          <Route path="/invoices/new" element={<InvoiceBuilderPage />} />
          <Route path="/invoices/:id" element={<InvoicePreviewPage />} />
          <Route path="/invoices/:id/edit" element={<InvoiceBuilderPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/payments" element={<PaymentListPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/templates" element={<TemplateGalleryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

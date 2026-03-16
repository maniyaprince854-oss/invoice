import { Search, Bell, Menu } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useSettingsStore } from '@/stores/settingsStore'

export function Topbar() {
  const { setGlobalSearchOpen, toggleSidebar } = useUIStore()
  const companyName = useSettingsStore((s) => s.company.name)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-slate-300 hover:bg-white"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search invoices, customers...</span>
          <kbd className="ml-4 hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline">
            Ctrl+K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
          <Bell className="h-5 w-5" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
            {companyName ? companyName[0]?.toUpperCase() : 'S'}
          </div>
        </div>
      </div>
    </header>
  )
}

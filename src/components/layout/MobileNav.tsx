import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, Package, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileItems = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/customers', label: 'Clients', icon: Users },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white lg:hidden">
      <div className="flex items-center justify-around py-2">
        {mobileItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium',
                isActive ? 'text-primary-600' : 'text-slate-400'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

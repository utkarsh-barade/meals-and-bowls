import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UtensilsCrossed,
  ClipboardList,
  CreditCard,
  BarChart3,
  Utensils,
  Menu,
  X,
} from 'lucide-react';

const adminNavItems = [
  { label: 'Dashboard',            href: '/admin/dashboard',        icon: LayoutDashboard },
  { label: 'Registration Requests',href: '/admin/requests',         icon: UserPlus },
  { label: 'Customers',            href: '/admin/customers',        icon: Users },
  { label: 'Meal Management',      href: '/admin/meal-management',  icon: UtensilsCrossed },
  { label: 'Meal History',         href: '/admin/meal-history',     icon: ClipboardList },
  { label: 'Payments',             href: '/admin/payments',         icon: CreditCard },
  { label: 'Reports',              href: '/admin/reports',          icon: BarChart3 },
];

const customerNavItems = [
  { label: 'Dashboard',    href: '/dashboard',      icon: LayoutDashboard },
  { label: 'Meal History', href: '/meal-history',   icon: ClipboardList },
  { label: 'Profile',      href: '/profile',        icon: Users },
];

/**
 * Fixed sidebar navigation. Role-aware nav items. Responsive: hidden on mobile with toggle.
 */
export default function Sidebar({ role = 'ADMIN' }) {
  const navItems = role === 'ADMIN' ? adminNavItems : customerNavItems;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white border border-surface-border rounded-btn shadow-card"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-white border-r border-surface-border flex flex-col shadow-sm transition-transform duration-200',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: 'var(--sidebar-width)' }}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-surface-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Utensils size={16} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-small font-bold text-text-primary">Meals & Bowls</p>
              <p className="text-caption text-text-secondary">
                {role === 'ADMIN' ? 'Admin Panel' : 'My Account'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <ul className="space-y-1">
            {navItems.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <NavLink
                  to={href}
                  end={href.endsWith('dashboard')}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-btn text-small font-medium',
                      'transition-colors duration-150 cursor-pointer',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                    )
                  }
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer hint */}
        <div className="p-4 border-t border-surface-border flex-shrink-0">
          <p className="text-caption text-text-placeholder text-center">
            Meals & Bowls v1.0
          </p>
        </div>
      </aside>
    </>
  );
}

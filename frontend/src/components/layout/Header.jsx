import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

/**
 * App header — top bar with logo and user menu.
 */
export default function Header({ title }) {
  const { user, logout } = useAuth();

  return (
    <header
      className="fixed top-0 right-0 left-0 z-30 h-16 bg-white border-b border-surface-border
                 flex items-center justify-between px-6 shadow-sm"
      style={{ paddingLeft: `max(1.5rem, calc(var(--sidebar-width) + 1.5rem))` }}
    >
      {/* Page title (injected per page) */}
      <h1 className="text-section-title text-text-primary font-semibold truncate">
        {title || 'Meals & Bowls'}
      </h1>

      {/* User area */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-small text-text-secondary">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <span className="font-medium text-text-primary">{user?.name || 'User'}</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-small
                     text-text-secondary hover:text-danger hover:bg-danger/5
                     transition-colors duration-150 cursor-pointer focus:outline-none
                     focus-visible:ring-2 focus-visible:ring-danger"
          title="Sign out"
        >
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}

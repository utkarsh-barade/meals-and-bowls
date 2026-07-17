import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Customer portal layout — lighter variant with customer nav.
 */
export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar role="CUSTOMER" />

      <div className="lg:ml-[var(--sidebar-width)]">
        <Header />

        <main
          className="p-6 min-h-screen"
          style={{ paddingTop: 'calc(var(--header-height) + 1.5rem)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

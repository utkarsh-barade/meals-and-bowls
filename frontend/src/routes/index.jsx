import { createBrowserRouter, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

// Layouts
import AdminLayout from '@/components/layout/AdminLayout';
import CustomerLayout from '@/components/layout/CustomerLayout';

// Auth pages
import AdminLogin from '@/pages/admin/auth/AdminLogin';
import CustomerLogin from '@/pages/customer/auth/CustomerLogin';
import CustomerSignUp from '@/pages/customer/auth/CustomerSignUp';

// Admin pages
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard';
import Customers from '@/pages/admin/customers/Customers';
import RegistrationRequests from '@/pages/admin/customers/RegistrationRequests';
import AddCustomer from '@/pages/admin/customers/AddCustomer';
import EditCustomer from '@/pages/admin/customers/EditCustomer';
import ViewCustomer from '@/pages/admin/customers/ViewCustomer';
import MealManagement from '@/pages/admin/meal-management/MealManagement';
import MealHistory from '@/pages/admin/meal-history/MealHistory';
import Payments from '@/pages/admin/payments/Payments';
import Reports from '@/pages/admin/reports/Reports';

// Customer pages
import CustomerDashboard from '@/pages/customer/dashboard/CustomerDashboard';
import CustomerMealHistory from '@/pages/customer/meal-history/CustomerMealHistory';
import Profile from '@/pages/customer/profile/Profile';

const router = createBrowserRouter([
  // ── Root redirect ────────────────────────────────────────
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // ── Public auth routes ───────────────────────────────────
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/login',
    element: <CustomerLogin />,
  },
  {
    path: '/signup',
    element: <CustomerSignUp />,
  },

  // ── Admin portal (protected, role: ADMIN) ────────────────
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard',       element: <AdminDashboard /> },
      { path: 'requests',        element: <RegistrationRequests /> },
      { path: 'customers',       element: <Customers /> },
      { path: 'customers/new',   element: <AddCustomer /> },
      { path: 'customers/:id',   element: <ViewCustomer /> },
      { path: 'customers/:id/edit', element: <EditCustomer /> },
      { path: 'meal-management', element: <MealManagement /> },
      { path: 'meal-history',    element: <MealHistory /> },
      { path: 'payments',        element: <Payments /> },
      { path: 'reports',         element: <Reports /> },
    ],
  },

  // ── Customer portal (protected, role: CUSTOMER) ──────────
  {
    path: '/',
    element: (
      <ProtectedRoute requiredRole="CUSTOMER">
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard',    element: <CustomerDashboard /> },
      { path: 'meal-history', element: <CustomerMealHistory /> },
      { path: 'profile',      element: <Profile /> },
    ],
  },

  // ── 404 fallback ─────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;

import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import {
  Users, UserCheck, Sun, Moon, Utensils,
  AlertTriangle, IndianRupee, RefreshCw
} from 'lucide-react';

const CARDS = [
  {
    key: 'totalCustomers',
    label: 'Total Customers',
    icon: Users,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/20',
  },
  {
    key: 'activeCustomers',
    label: 'Active Customers',
    icon: UserCheck,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
  {
    key: 'lunchServedToday',
    label: 'Lunch Served Today',
    icon: Sun,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  {
    key: 'dinnerServedToday',
    label: 'Dinner Served Today',
    icon: Moon,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    key: 'totalMealsServedToday',
    label: 'Total Meals Today',
    icon: Utensils,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
  {
    key: 'plansExpiringSoon',
    label: 'Plans Expiring Soon',
    sublabel: 'within 7 days',
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  {
    key: 'todaysCollection',
    label: "Today's Collection",
    icon: IndianRupee,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    isCurrency: true,
  },
];

function StatCard({ card, value, loading }) {
  const Icon = card.icon;

  const displayValue = loading
    ? '—'
    : card.isCurrency
    ? `₹${Number(value ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`
    : (value ?? 0).toLocaleString();

  return (
    <div className={`bg-surface-card rounded-card p-6 shadow-card border ${card.border} flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <p className="text-small font-medium text-text-secondary">{card.label}</p>
        <span className={`p-2.5 rounded-xl ${card.bg}`}>
          <Icon className={`w-5 h-5 ${card.color}`} />
        </span>
      </div>
      <div>
        <p className={`text-3xl font-bold ${loading ? 'text-text-placeholder animate-pulse' : 'text-text-primary'}`}>
          {displayValue}
        </p>
        {card.sublabel && (
          <p className="text-caption text-text-placeholder mt-1">{card.sublabel}</p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: reportService.getDashboardStats,
    refetchInterval: 60_000, // auto-refresh every minute
  });

  const stats = data?.data?.data ?? {};
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-page-title text-text-primary">Dashboard</h1>
          <p className="text-small text-text-secondary mt-1">{today}</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 text-small font-medium text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {isError && (
        <div className="bg-danger/10 border border-danger/20 text-danger rounded-card p-4 text-small">
          Failed to load dashboard stats. Please refresh.
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {CARDS.map((card) => (
          <StatCard
            key={card.key}
            card={card}
            value={stats[card.key]}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Today's Summary hint */}
      <div className="bg-surface-muted rounded-card border border-surface-border p-5">
        <h2 className="text-card-title font-semibold text-text-primary mb-1">Today's Summary</h2>
        <p className="text-small text-text-secondary">
          {isLoading
            ? 'Loading summary...'
            : `${stats.totalMealsServedToday ?? 0} meals served today — ${stats.lunchServedToday ?? 0} lunch, ${stats.dinnerServedToday ?? 0} dinner. ₹${Number(stats.todaysCollection ?? 0).toLocaleString('en-IN')} collected.`}
        </p>
      </div>
    </div>
  );
}

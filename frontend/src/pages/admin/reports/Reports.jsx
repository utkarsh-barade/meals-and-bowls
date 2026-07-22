import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import { customerService } from '@/services/customerService';
import Card from '@/components/ui/Card';
import {
  CalendarDays, User, Clock, CreditCard,
  CheckCircle2, XCircle, ChevronDown
} from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

// ─── helpers ────────────────────────────────────────────────────────────────

function StatusBadge({ children, color }) {
  const map = {
    green:  'bg-success/10 text-success',
    yellow: 'bg-warning/10 text-warning',
    red:    'bg-danger/10 text-danger',
    blue:   'bg-info/10 text-info',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[color] ?? map.blue}`}>
      {children}
    </span>
  );
}

const EmptyRow = ({ icon: Icon, msg }) => (
  <div className="py-14 text-center">
    <Icon className="w-12 h-12 text-text-placeholder mx-auto mb-3 opacity-40" />
    <p className="text-small text-text-secondary">{msg}</p>
  </div>
);

const Spinner = () => (
  <p className="p-6 text-small text-text-secondary animate-pulse">Loading…</p>
);

// ─── Tab 1 — Daily Meal Report ───────────────────────────────────────────────

function DailyMealReport() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['report-daily-meals', date],
    queryFn: () => reportService.getDailyMealReport(date),
  });

  const rows = data?.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="text-small font-medium text-text-secondary whitespace-nowrap">Select Date:</label>
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split('T')[0]}
          onChange={e => setDate(e.target.value)}
          className="h-10 px-3 border border-surface-border rounded-xl text-small text-text-primary bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <span className="text-caption text-text-placeholder">{rows.length} customer(s)</span>
      </div>

      {isLoading ? <Spinner /> : rows.length === 0 ? (
        <EmptyRow icon={CalendarDays} msg="No meals served on this date." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-border">
          <table className="w-full text-left border-collapse text-small">
            <thead>
              <tr className="bg-surface-muted text-text-secondary font-medium border-b border-surface-border">
                <th className="p-4">Customer</th>
                <th className="p-4">Mobile</th>
                <th className="p-4 text-center">Lunch</th>
                <th className="p-4 text-center">Dinner</th>
                <th className="p-4 text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {rows.map(r => (
                <tr key={r.customerId} className="hover:bg-surface-muted/50">
                  <td className="p-4 font-semibold">{r.customerName}</td>
                  <td className="p-4 text-text-secondary">{r.customerMobile}</td>
                  <td className="p-4 text-center">
                    {r.lunchServed
                      ? <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                      : <XCircle className="w-5 h-5 text-text-placeholder mx-auto opacity-40" />}
                  </td>
                  <td className="p-4 text-center">
                    {r.dinnerServed
                      ? <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                      : <XCircle className="w-5 h-5 text-text-placeholder mx-auto opacity-40" />}
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge color={r.totalMeals === 2 ? 'green' : 'blue'}>{r.totalMeals}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab 2 — Customer Meal Report ─────────────────────────────────────────────

function CustomerMealReport() {
  const [selectedId, setSelectedId] = useState('');

  const { data: custData } = useQuery({
    queryKey: ['customers-all'],
    queryFn: () => customerService.getCustomers('', 0, 200),
  });
  const customers = custData?.data?.content ?? [];

  const { data, isLoading } = useQuery({
    queryKey: ['report-customer-meals', selectedId],
    queryFn: () => reportService.getCustomerMealReport(selectedId),
    enabled: !!selectedId,
  });

  const rows = data?.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="text-small font-medium text-text-secondary whitespace-nowrap">Select Customer:</label>
        <div className="relative">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="h-10 pl-3 pr-8 border border-surface-border rounded-xl text-small text-text-primary bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none min-w-[220px]"
          >
            <option value="">— choose a customer —</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.fullName} ({c.mobileNumber})</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-text-secondary absolute right-2.5 top-3 pointer-events-none" />
        </div>
      </div>

      {!selectedId ? (
        <EmptyRow icon={User} msg="Select a customer to view their meal history." />
      ) : isLoading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyRow icon={User} msg="No meals recorded for this customer." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-border">
          <table className="w-full text-left border-collapse text-small">
            <thead>
              <tr className="bg-surface-muted text-text-secondary font-medium border-b border-surface-border">
                <th className="p-4">Date</th>
                <th className="p-4">Meal Type</th>
                <th className="p-4">Action</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {rows.map(r => (
                <tr key={r.logId} className="hover:bg-surface-muted/50">
                  <td className="p-4 font-medium">{formatDate(r.mealDate)}</td>
                  <td className="p-4">
                    <StatusBadge color={r.mealType === 'LUNCH' ? 'yellow' : 'blue'}>{r.mealType}</StatusBadge>
                  </td>
                  <td className="p-4">
                    <StatusBadge color={r.action === 'SERVED' ? 'green' : 'blue'}>{r.action}</StatusBadge>
                  </td>
                  <td className="p-4 text-text-secondary text-caption">
                    {r.servedAt ? new Date(r.servedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3 — Expiring Plans ───────────────────────────────────────────────────

function ExpiringPlans() {
  const [days, setDays] = useState(7);

  const { data, isLoading } = useQuery({
    queryKey: ['report-expiring-plans', days],
    queryFn: () => reportService.getExpiringPlans(days),
  });

  const rows = data?.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="text-small font-medium text-text-secondary whitespace-nowrap">Expiring within:</label>
        <div className="flex gap-2">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-small font-medium transition-colors ${
                days === d
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-text-secondary hover:text-text-primary border border-surface-border'
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
        <span className="text-caption text-text-placeholder">{rows.length} plan(s)</span>
      </div>

      {isLoading ? <Spinner /> : rows.length === 0 ? (
        <EmptyRow icon={Clock} msg={`No plans expiring within ${days} days.`} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-border">
          <table className="w-full text-left border-collapse text-small">
            <thead>
              <tr className="bg-surface-muted text-text-secondary font-medium border-b border-surface-border">
                <th className="p-4">Customer</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4 text-center">Days Left</th>
                <th className="p-4 text-center">Meals Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {rows.map(r => (
                <tr key={r.subscriptionId} className="hover:bg-surface-muted/50">
                  <td className="p-4 font-semibold">{r.customerName}</td>
                  <td className="p-4 text-text-secondary">{r.customerMobile}</td>
                  <td className="p-4">{r.planName}</td>
                  <td className="p-4 text-text-secondary">
                    {formatDate(r.expiryDate)}
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge color={r.daysLeft <= 3 ? 'red' : 'yellow'}>{r.daysLeft}d</StatusBadge>
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge color={r.mealsRemaining <= 5 ? 'red' : 'green'}>{r.mealsRemaining}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4 — Pending Payments ─────────────────────────────────────────────────

function PendingPayments() {
  const { data, isLoading } = useQuery({
    queryKey: ['report-pending-payments'],
    queryFn: reportService.getPendingPayments,
  });

  const rows = data?.data?.data ?? [];

  return (
    <div className="space-y-4">
      {isLoading ? <Spinner /> : rows.length === 0 ? (
        <EmptyRow icon={CreditCard} msg="No pending payments. All settled up!" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-border">
          <table className="w-full text-left border-collapse text-small">
            <thead>
              <tr className="bg-surface-muted text-text-secondary font-medium border-b border-surface-border">
                <th className="p-4">Customer</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-text-primary">
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-surface-muted/50">
                  <td className="p-4 font-semibold">{r.customerName}</td>
                  <td className="p-4 text-text-secondary">{r.customerMobile}</td>
                  <td className="p-4">{r.planName ?? <span className="text-text-placeholder">Manual</span>}</td>
                  <td className="p-4 font-semibold text-primary">₹{r.amount}</td>
                  <td className="p-4 text-text-secondary">
                    {formatDate(r.paymentDate)}
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge color="red">PENDING</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Reports Page ────────────────────────────────────────────────────────

const TABS = [
  { id: 'daily',    label: 'Daily Meal Report',    icon: CalendarDays, component: DailyMealReport },
  { id: 'customer', label: 'Customer Meal Report',  icon: User,         component: CustomerMealReport },
  { id: 'expiring', label: 'Expiring Plans',        icon: Clock,        component: ExpiringPlans },
  { id: 'pending',  label: 'Pending Payments',      icon: CreditCard,   component: PendingPayments },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('daily');

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component ?? DailyMealReport;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-page-title text-text-primary">Reports</h1>
        <p className="text-small text-text-secondary mt-1">
          Business insights — meal activity, expiring plans and payments
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-surface-border pb-0">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`reports-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-small font-medium border-b-2 transition-colors -mb-px ${
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <Card>
        <Card.Body>
          <ActiveComponent />
        </Card.Body>
      </Card>
    </div>
  );
}

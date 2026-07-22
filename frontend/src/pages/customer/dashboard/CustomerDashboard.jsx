import { useQuery } from '@tanstack/react-query';
import { customerPortalService } from '@/services/customerPortalService';
import Card from '@/components/ui/Card';
import { Package, Utensils, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

export default function CustomerDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-dashboard'],
    queryFn: customerPortalService.getDashboard
  });

  if (isLoading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-danger">Failed to load dashboard.</div>;

  const dashboard = data?.data;
  const { activeSubscription, todayMealStatus, pendingPayments } = dashboard || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-page-title text-text-primary">My Dashboard</h1>
        <p className="text-small text-text-secondary">Welcome back to Meals & Bowls</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Info */}
        <Card>
          <Card.Header>
            <h2 className="text-h4 font-semibold text-text-primary flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Active Plan
            </h2>
          </Card.Header>
          <Card.Body>
            {activeSubscription ? (
              <div className="space-y-4">
                <div>
                  <p className="text-caption text-text-secondary uppercase tracking-wider">Plan Details</p>
                  <p className="text-body font-medium">{activeSubscription.plan?.name}</p>
                  <p className="text-small text-text-secondary">
                    Valid from {formatDate(activeSubscription.startDate)} to {formatDate(activeSubscription.expiryDate)}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-surface-border">
                  <p className="text-caption text-text-secondary uppercase tracking-wider mb-2">Meal Balance</p>
                  <div className="flex justify-between items-center bg-surface-muted p-3 rounded-lg">
                    <div className="text-center">
                      <p className="text-h3 font-bold text-text-primary">{activeSubscription.mealsTotal}</p>
                      <p className="text-xs text-text-secondary">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-h3 font-bold text-warning">{activeSubscription.mealsConsumed}</p>
                      <p className="text-xs text-text-secondary">Consumed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-h3 font-bold text-success">{activeSubscription.mealsRemaining}</p>
                      <p className="text-xs text-text-secondary">Remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-text-secondary">
                <p>No active subscription found.</p>
                <p className="text-small mt-1">Please contact the admin to purchase a plan.</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <div className="space-y-6">
          {/* Today's Meals */}
          <Card>
            <Card.Header>
              <h2 className="text-h4 font-semibold text-text-primary flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" /> Today's Meals
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="flex gap-4">
                <div className="flex-1 bg-surface-muted rounded-lg p-4 text-center">
                  <p className="text-small font-medium mb-2">Lunch</p>
                  {todayMealStatus?.lunchServed ? (
                    <span className="inline-block px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">Served</span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-surface-border/50 text-text-secondary text-xs font-semibold rounded-full">Not Served</span>
                  )}
                </div>
                <div className="flex-1 bg-surface-muted rounded-lg p-4 text-center">
                  <p className="text-small font-medium mb-2">Dinner</p>
                  {todayMealStatus?.dinnerServed ? (
                    <span className="inline-block px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">Served</span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-surface-border/50 text-text-secondary text-xs font-semibold rounded-full">Not Served</span>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Pending Payments */}
          {pendingPayments && pendingPayments.length > 0 && (
            <Card className="border-danger/30">
              <Card.Header className="bg-danger/5 border-b border-danger/10">
                <h2 className="text-h4 font-semibold text-danger flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Pending Payments
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 border border-surface-border rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">{payment.planName || 'Manual Payment'}</p>
                        <p className="text-xs text-text-secondary">Due: {formatDate(payment.paymentDate)}</p>
                      </div>
                      <p className="font-bold text-danger">₹{payment.amount}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

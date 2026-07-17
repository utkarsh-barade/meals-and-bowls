import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import Card from '@/components/ui/Card';
import { ArrowLeft, User, Phone, Calendar, CreditCard, Activity } from 'lucide-react';
import Button from '@/components/ui/Button';
import PhotoUpload from '@/components/ui/PhotoUpload';
import { subscriptionService } from '@/services/subscriptionService';
import AssignPlanModal from './AssignPlanModal';

export default function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomer(id),
  });

  const { data: subResponse, isLoading: subLoading } = useQuery({
    queryKey: ['customer-subscription', id],
    queryFn: () => subscriptionService.getActiveSubscription(id),
  });

  if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading...</div>;
  if (isError) return <div className="p-8 text-center text-danger">Failed to load customer</div>;

  const customer = response?.data;
  const subscription = subResponse?.data?.data;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/customers')} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-page-title text-text-primary">Customer Profile</h1>
        </div>
        <Button onClick={() => navigate(`/admin/customers/${id}/edit`)}>
          Edit Details
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <Card.Body className="flex flex-col items-center pt-8">
            <PhotoUpload customerId={id} currentPhotoUrl={customer.photoUrl} />
            <h2 className="mt-4 text-card-title text-center break-words w-full">{customer.fullName}</h2>
            <p className="text-text-secondary text-small text-center">{customer.mobileNumber}</p>
          </Card.Body>
        </Card>

        <Card className="md:col-span-2">
          <Card.Header>
            <Card.Title>Personal Information</Card.Title>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-text-placeholder mt-0.5" />
              <div>
                <p className="text-small text-text-secondary">Full Name</p>
                <p className="font-medium">{customer.fullName}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-text-placeholder mt-0.5" />
              <div>
                <p className="text-small text-text-secondary">Mobile Number</p>
                <p className="font-medium">{customer.mobileNumber}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-text-placeholder mt-0.5" />
              <div>
                <p className="text-small text-text-secondary">Joined On</p>
                <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Header className="flex flex-row justify-between items-center">
          <Card.Title>Subscription Status</Card.Title>
          <Button variant={subscription ? "secondary" : "primary"} onClick={() => setIsAssignModalOpen(true)}>
            {subscription ? 'Renew / Change Plan' : 'Assign Plan'}
          </Button>
        </Card.Header>
        <Card.Body>
          {subLoading ? (
            <div className="text-text-secondary">Loading subscription...</div>
          ) : subscription ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{subscription.plan.name} Plan</p>
                      <p className="text-small text-text-secondary">₹{subscription.plan.price}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-success/10 text-success text-xs font-bold uppercase tracking-wider rounded-full">
                    {subscription.status}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Calendar className="w-5 h-5 text-text-placeholder" />
                  <div className="flex-1 flex justify-between text-small">
                    <span className="text-text-secondary">Start: <strong className="text-text-primary font-medium">{new Date(subscription.startDate).toLocaleDateString()}</strong></span>
                    <span className="text-text-secondary">Expires: <strong className="text-text-primary font-medium">{new Date(subscription.expiryDate).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-small">
                  <span className="text-text-secondary font-medium">Meals Progress</span>
                  <span className="font-bold text-primary">{subscription.mealsConsumed} / {subscription.mealsTotal}</span>
                </div>
                <div className="h-3 w-full bg-surface-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${Math.min(100, (subscription.mealsConsumed / subscription.mealsTotal) * 100)}%` }}
                  />
                </div>
                <p className="text-right text-caption text-text-secondary">
                  {subscription.mealsRemaining} meals remaining
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-surface-border rounded-lg">
              <Activity className="w-12 h-12 text-text-placeholder mx-auto mb-3 opacity-50" />
              <h3 className="text-h4 font-medium text-text-primary mb-1">No Active Subscription</h3>
              <p className="text-text-secondary text-small max-w-sm mx-auto">
                This customer does not have an active plan. Assign a plan to allow them to take meals.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {isAssignModalOpen && (
        <AssignPlanModal customerId={id} onClose={() => setIsAssignModalOpen(false)} />
      )}
    </div>
  );
}

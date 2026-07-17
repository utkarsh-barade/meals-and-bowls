import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscriptionService';
import Button from '@/components/ui/Button';

export default function AssignPlanModal({ customerId, onClose }) {
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const { data: plansResponse, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: subscriptionService.getPlans
  });

  const { mutate: assignPlan, isPending } = useMutation({
    mutationFn: (planId) => subscriptionService.assignPlan(customerId, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-subscription', customerId] });
      onClose();
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to assign plan');
    }
  });

  const plans = plansResponse?.data?.data || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface-card rounded-card shadow-lg w-full max-w-md p-6">
        <h2 className="text-h3 font-semibold mb-4 text-text-primary">Assign New Plan</h2>
        
        {isLoadingPlans ? (
          <p className="text-text-secondary">Loading plans...</p>
        ) : (
          <div className="space-y-4">
            {plans.map(plan => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-surface-border hover:border-primary/50'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-text-primary">{plan.name} Plan</span>
                  <span className="font-bold text-primary">₹{plan.price}</span>
                </div>
                <div className="text-small text-text-secondary">
                  {plan.totalMeals} Meals • {plan.validityDays} Days Validity
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button 
            disabled={!selectedPlan || isPending} 
            onClick={() => assignPlan(selectedPlan)}
          >
            {isPending ? 'Assigning...' : 'Assign Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
}

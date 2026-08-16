import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscriptionService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AssignPlanModal({ customerId, onClose }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' or 'custom'
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Custom Plan form state
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customTotalMeals, setCustomTotalMeals] = useState('');
  const [customValidityDays, setCustomValidityDays] = useState('');
  
  const { data: plansResponse, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: subscriptionService.getPlans
  });

  const { mutate: assignPlan, isPending } = useMutation({
    mutationFn: (payload) => subscriptionService.assignPlan(customerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-subscription', customerId] });
      onClose();
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to assign plan');
    }
  });

  const plans = plansResponse?.data?.data || [];

  const handleSubmit = () => {
    if (activeTab === 'standard') {
      if (!selectedPlan) return;
      assignPlan({ planId: selectedPlan });
    } else {
      if (!customName.trim() || !customPrice || !customTotalMeals || !customValidityDays) {
        alert('Please fill all fields');
        return;
      }
      assignPlan({
        isCustom: true,
        customName: customName.trim(),
        customPrice: parseFloat(customPrice),
        customTotalMeals: parseInt(customTotalMeals, 10),
        customValidityDays: parseInt(customValidityDays, 10)
      });
    }
  };

  const isSubmitDisabled = activeTab === 'standard'
    ? !selectedPlan || isPending
    : (!customName.trim() || !customPrice || !customTotalMeals || !customValidityDays) || isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface-card rounded-card shadow-lg w-full max-w-md p-6">
        <h2 className="text-h3 font-semibold mb-4 text-text-primary">Assign New Plan</h2>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-surface-border mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`flex-1 pb-3 text-body font-medium transition-colors border-b-2 ${
              activeTab === 'standard'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Standard Plans
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 pb-3 text-body font-medium transition-colors border-b-2 ${
              activeTab === 'custom'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Custom Plan
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[350px] overflow-y-auto pr-1">
          {activeTab === 'standard' ? (
            isLoadingPlans ? (
              <p className="text-text-secondary">Loading plans...</p>
            ) : (
              <div className="space-y-4">
                {plans.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan === plan.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-border hover:border-primary/50'
                    }`}
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
            )
          ) : (
            <div className="space-y-4">
              <Input
                label="Plan Name"
                placeholder="e.g. Custom Corporate Plan"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  placeholder="e.g. 2500"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  required
                  min="0"
                />
                <Input
                  label="Total Meals"
                  type="number"
                  placeholder="e.g. 40"
                  value={customTotalMeals}
                  onChange={(e) => setCustomTotalMeals(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <Input
                label="Validity (Days)"
                type="number"
                placeholder="e.g. 30"
                value={customValidityDays}
                onChange={(e) => setCustomValidityDays(e.target.value)}
                required
                min="1"
              />
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button 
            disabled={isSubmitDisabled} 
            onClick={handleSubmit}
          >
            {isPending ? 'Assigning...' : 'Assign Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
}

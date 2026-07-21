import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import { mealService } from '@/services/mealService';
import { subscriptionService } from '@/services/subscriptionService';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Search, Utensils, CheckCircle } from 'lucide-react';

function CustomerMealRow({ customer }) {
  const queryClient = useQueryClient();
  const today = new Date().toLocaleDateString('en-CA');

  const { data: subResponse } = useQuery({
    queryKey: ['customer-subscription', customer.id],
    queryFn: () => subscriptionService.getActiveSubscription(customer.id),
  });

  const subscription = subResponse?.data?.data;

  const { data: historyResponse } = useQuery({
    queryKey: ['meal-history', customer.id, today],
    queryFn: () => mealService.getMealHistory(customer.id, today, today),
    enabled: !!subscription
  });

  const todayStatus = historyResponse?.data?.data?.[today] || { lunchServed: false, dinnerServed: false };

  const { mutate: serveMeal, isPending } = useMutation({
    mutationFn: (type) => mealService.serveMeal(customer.id, today, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-subscription', customer.id] });
      queryClient.invalidateQueries({ queryKey: ['meal-history', customer.id, today] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to serve meal');
    }
  });

  return (
    <div className="flex items-center justify-between p-4 border border-surface-border rounded-lg mb-4 hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-4">
        {customer.photoUrl ? (
          <img src={customer.photoUrl} alt="profile" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {customer.fullName.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-text-primary">{customer.fullName}</h3>
          <p className="text-small text-text-secondary">{customer.mobileNumber}</p>
        </div>
      </div>

      {!subscription ? (
        <span className="text-small text-danger bg-danger/10 px-3 py-1 rounded-full font-medium">No Active Plan</span>
      ) : subscription.mealsRemaining <= 0 ? (
        <span className="text-small text-danger bg-danger/10 px-3 py-1 rounded-full font-medium">0 Meals Left</span>
      ) : (
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="text-small font-medium text-text-primary">{subscription.plan.name}</p>
            <p className="text-caption text-text-secondary">{subscription.mealsRemaining} meals left</p>
          </div>
          
          <Button 
            variant={todayStatus.lunchServed ? "secondary" : "primary"}
            disabled={isPending || todayStatus.lunchServed}
            onClick={() => serveMeal('LUNCH')}
            className="w-32"
          >
            {todayStatus.lunchServed ? <><CheckCircle className="w-4 h-4 mr-2"/> Lunch Served</> : <><Utensils className="w-4 h-4 mr-2"/> Serve Lunch</>}
          </Button>

          <Button 
            variant={todayStatus.dinnerServed ? "secondary" : "primary"}
            disabled={isPending || todayStatus.dinnerServed}
            onClick={() => serveMeal('DINNER')}
            className="w-32"
          >
             {todayStatus.dinnerServed ? <><CheckCircle className="w-4 h-4 mr-2"/> Dinner Served</> : <><Utensils className="w-4 h-4 mr-2"/> Serve Dinner</>}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function MealManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['customers', searchTerm, 0],
    queryFn: () => customerService.getCustomers(searchTerm, 0, 50),
  });

  const customers = response?.data?.content || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Meal Management</h1>
      </div>

      <Card>
        <Card.Body>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Search by name or mobile to serve meals..." 
              className="pl-10 max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p className="text-text-secondary">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="text-text-secondary">No customers found.</p>
          ) : (
            <div className="space-y-2">
              {customers.map(customer => (
                <CustomerMealRow key={customer.id} customer={customer} />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

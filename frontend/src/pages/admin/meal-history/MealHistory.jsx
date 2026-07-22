import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import { mealService } from '@/services/mealService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, Calendar, ChevronLeft, ChevronRight, Utensils, CheckCircle, XCircle, Users } from 'lucide-react';

function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysInMonth(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function MealHistory() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch customers for search
  const { data: customerResponse, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers', searchTerm, 0],
    queryFn: () => customerService.getCustomers(searchTerm, 0, 10),
    enabled: searchTerm.length > 1
  });

  const customers = customerResponse?.data?.content || [];

  // Start and end date for the selected month (using local date formatting)
  const startDate = formatDateLocal(new Date(year, month, 1));
  const endDate = formatDateLocal(new Date(year, month + 1, 0));

  // Fetch meal history
  const { data: historyResponse, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['meal-history', selectedCustomer?.id, startDate, endDate],
    queryFn: () => mealService.getMealHistory(selectedCustomer.id, startDate, endDate),
    enabled: !!selectedCustomer
  });

  const history = historyResponse?.data?.data || {};

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);

  const { mutate: correctMeal } = useMutation({
    mutationFn: ({ date, type, isServed }) => mealService.correctMeal(selectedCustomer.id, date, type, isServed),
    onMutate: async ({ date, type, isServed }) => {
      await queryClient.cancelQueries({ queryKey: ['meal-history', selectedCustomer.id, startDate, endDate] });
      const previousData = queryClient.getQueryData(['meal-history', selectedCustomer.id, startDate, endDate]);

      queryClient.setQueryData(['meal-history', selectedCustomer.id, startDate, endDate], (old) => {
        if (!old?.data?.data) return old;
        const currentDayObj = old.data.data[date] || { mealDate: date, lunchServed: false, dinnerServed: false };
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              [date]: {
                ...currentDayObj,
                lunchServed: type === 'LUNCH' ? isServed : currentDayObj.lunchServed,
                dinnerServed: type === 'DINNER' ? isServed : currentDayObj.dinnerServed,
              },
            },
          },
        };
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['meal-history', selectedCustomer.id, startDate, endDate], context.previousData);
      }
      alert(error.response?.data?.message || 'Failed to correct meal');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-history', selectedCustomer.id, startDate, endDate] });
    }
  });

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">Meal History & Corrections</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Customer Search Section */}
        <Card className="md:col-span-1 h-fit">
          <Card.Header>
            <Card.Title>Select Customer</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value === '') setSelectedCustomer(null);
                }}
              />
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
              {isLoadingCustomers && <p className="text-small text-text-secondary">Loading...</p>}
              {customers.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    selectedCustomer?.id === c.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-surface-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-small text-text-primary">{c.fullName}</p>
                  <p className="text-caption text-text-secondary">{c.mobileNumber}</p>
                </div>
              ))}
              {searchTerm.length > 1 && customers.length === 0 && !isLoadingCustomers && (
                <p className="text-small text-text-secondary">No customers found.</p>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* History Table Section */}
        <Card className="md:col-span-3">
          <Card.Header className="flex flex-row items-center justify-between">
            <Card.Title>
              {selectedCustomer ? `${selectedCustomer.fullName}'s History` : 'No Customer Selected'}
            </Card.Title>
            
            {selectedCustomer && (
              <div className="flex items-center space-x-4 bg-surface-muted px-2 py-1 rounded-lg">
                <Button variant="ghost" onClick={handlePrevMonth} className="p-1"><ChevronLeft className="w-5 h-5"/></Button>
                <div className="flex items-center space-x-2 font-medium min-w-[120px] justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                </div>
                <Button variant="ghost" onClick={handleNextMonth} className="p-1"><ChevronRight className="w-5 h-5"/></Button>
              </div>
            )}
          </Card.Header>
          <Card.Body>
            {!selectedCustomer ? (
              <div className="py-12 text-center border-2 border-dashed border-surface-border rounded-lg">
                <Users className="w-12 h-12 text-text-placeholder mx-auto mb-3 opacity-50" />
                <h3 className="text-h4 font-medium text-text-primary mb-1">Search & Select a Customer</h3>
                <p className="text-text-secondary text-small">
                  Select a customer from the left to view and correct their meal history.
                </p>
              </div>
            ) : isLoadingHistory ? (
              <p className="text-text-secondary p-4">Loading history...</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-surface-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted border-b border-surface-border text-small text-text-secondary font-medium">
                      <th className="p-4 w-1/3">Date</th>
                      <th className="p-4 w-1/3 text-center">Lunch</th>
                      <th className="p-4 w-1/3 text-center">Dinner</th>
                    </tr>
                  </thead>
                  <tbody className="text-small text-text-primary divide-y divide-surface-border">
                    {daysInMonth.map(date => {
                      const dateStr = formatDateLocal(date);
                      const status = history[dateStr] || { lunchServed: false, dinnerServed: false };
                      const isFuture = date > new Date();

                      return (
                        <tr key={dateStr} className={`hover:bg-surface-muted/50 ${isFuture ? 'opacity-50' : ''}`}>
                          <td className="p-4 font-medium">{date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                          
                          <td className="p-4">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              {status.lunchServed ? (
                                <span className="flex items-center text-success bg-success/10 px-2 py-1 rounded text-xs font-bold">
                                  <CheckCircle className="w-3 h-3 mr-1"/> SERVED
                                </span>
                              ) : (
                                <span className="flex items-center text-text-placeholder bg-surface-muted px-2 py-1 rounded text-xs font-medium">
                                  <XCircle className="w-3 h-3 mr-1"/> UNSERVED
                                </span>
                              )}
                              {!isFuture && (
                                <button 
                                  onClick={() => correctMeal({ date: dateStr, type: 'LUNCH', isServed: !status.lunchServed })}
                                  className="text-xs text-primary hover:underline font-medium"
                                >
                                  Mark {status.lunchServed ? 'Unserved' : 'Served'}
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              {status.dinnerServed ? (
                                <span className="flex items-center text-success bg-success/10 px-2 py-1 rounded text-xs font-bold">
                                  <CheckCircle className="w-3 h-3 mr-1"/> SERVED
                                </span>
                              ) : (
                                <span className="flex items-center text-text-placeholder bg-surface-muted px-2 py-1 rounded text-xs font-medium">
                                  <XCircle className="w-3 h-3 mr-1"/> UNSERVED
                                </span>
                              )}
                              {!isFuture && (
                                <button 
                                  onClick={() => correctMeal({ date: dateStr, type: 'DINNER', isServed: !status.dinnerServed })}
                                  className="text-xs text-primary hover:underline font-medium"
                                >
                                  Mark {status.dinnerServed ? 'Unserved' : 'Served'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

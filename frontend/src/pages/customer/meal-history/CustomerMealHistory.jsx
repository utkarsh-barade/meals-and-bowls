import { useQuery } from '@tanstack/react-query';
import { customerPortalService } from '@/services/customerPortalService';
import Card from '@/components/ui/Card';
import { Calendar, Check, Minus } from 'lucide-react';

export default function CustomerMealHistory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-meal-history'],
    queryFn: customerPortalService.getMealHistory
  });

  if (isLoading) return <div className="p-4">Loading meal history...</div>;
  if (error) return <div className="p-4 text-danger">Failed to load meal history.</div>;

  const historyMap = data?.data || {};
  
  // Convert map to sorted array (newest first)
  const historyList = Object.entries(historyMap)
    .map(([date, status]) => ({
      date,
      ...status
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-page-title text-text-primary">Meal History</h1>
        <p className="text-small text-text-secondary">Your served meals for the last 30 days</p>
      </div>

      <Card>
        <Card.Body>
          {historyList.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="w-12 h-12 text-text-placeholder mx-auto mb-3 opacity-50" />
              <h3 className="text-h4 font-medium text-text-primary mb-1">No Meal History</h3>
              <p className="text-text-secondary text-small">No meals have been served in the last 30 days.</p>
            </div>
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
                  {historyList.map((row) => (
                    <tr key={row.date} className="hover:bg-surface-muted/50">
                      <td className="p-4 font-medium">
                        {new Date(row.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4 text-center">
                        {row.lunchServed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-success/10 text-success rounded-full mx-auto">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-text-placeholder mx-auto">
                            <Minus className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.dinnerServed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-success/10 text-success rounded-full mx-auto">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-text-placeholder mx-auto">
                            <Minus className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

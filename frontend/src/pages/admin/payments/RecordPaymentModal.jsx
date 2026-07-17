import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import { paymentService } from '@/services/paymentService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { X, Search } from 'lucide-react';

export default function RecordPaymentModal({ onClose }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('PAID');

  const { data: customerResponse, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers', searchTerm, 0],
    queryFn: () => customerService.getCustomers(searchTerm, 0, 5),
    enabled: searchTerm.length > 1
  });

  const customers = customerResponse?.data?.content || [];

  const { mutate: record, isPending } = useMutation({
    mutationFn: paymentService.recordPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
      onClose();
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to record payment');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    record({
      customerId: selectedCustomer.id,
      amount: Number(amount),
      paymentDate,
      status
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border border-surface-border">
        <Card.Header className="flex flex-row justify-between items-center">
          <Card.Title>Record Payment</Card.Title>
          <Button variant="ghost" onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </Button>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Search/Select Customer */}
            <div className="space-y-2">
              <label className="text-small font-medium text-text-primary">Search Customer</label>
              {!selectedCustomer ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Type name or phone..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm.length > 1 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface-card border border-surface-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {isLoadingCustomers ? (
                        <p className="p-3 text-caption text-text-secondary">Loading...</p>
                      ) : customers.length === 0 ? (
                        <p className="p-3 text-caption text-text-secondary">No customers found</p>
                      ) : (
                        customers.map(c => (
                          <div
                            key={c.id}
                            className="p-3 hover:bg-surface-muted cursor-pointer transition-colors border-b border-surface-border/50"
                            onClick={() => {
                              setSelectedCustomer(c);
                              setSearchTerm('');
                            }}
                          >
                            <p className="font-semibold text-small">{c.fullName}</p>
                            <p className="text-caption text-text-secondary">{c.mobileNumber}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div>
                    <p className="font-semibold text-small text-text-primary">{selectedCustomer.fullName}</p>
                    <p className="text-caption text-text-secondary">{selectedCustomer.mobileNumber}</p>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedCustomer(null)} className="text-xs text-danger">
                    Change
                  </Button>
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-small font-medium text-text-primary">Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-small font-medium text-text-primary">Payment Date</label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-small font-medium text-text-primary font-semibold block">Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-small text-text-primary cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="PAID"
                    checked={status === 'PAID'}
                    onChange={() => setStatus('PAID')}
                    className="accent-primary w-4 h-4"
                  />
                  Paid
                </label>
                <label className="flex items-center gap-2 text-small text-text-primary cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="PENDING"
                    checked={status === 'PENDING'}
                    onChange={() => setStatus('PENDING')}
                    className="accent-primary w-4 h-4"
                  />
                  Pending
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? 'Saving...' : 'Record Payment'}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}

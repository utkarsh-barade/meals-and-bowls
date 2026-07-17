import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RecordPaymentModal from './RecordPaymentModal';
import { DollarSign, Check, Clock, Calendar } from 'lucide-react';

export default function Payments() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: pendingResponse, isLoading: loadingPending } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: paymentService.getPendingPayments
  });

  const { data: allResponse, isLoading: loadingAll } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentService.getPayments
  });

  const pendingPayments = pendingResponse?.data?.data || [];
  const allPayments = allResponse?.data?.data || [];

  const { mutate: markAsPaid } = useMutation({
    mutationFn: ({ id }) => paymentService.updatePaymentStatus(id, 'PAID'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update payment');
    }
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Payments & Billing</h1>
          <p className="text-small text-text-secondary">Track, record, and verify subscription transactions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Record Payment
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-border">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium text-small border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Pending Payments ({pendingPayments.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium text-small border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          All Transactions ({allPayments.length})
        </button>
      </div>

      <Card>
        <Card.Body>
          {activeTab === 'pending' ? (
            loadingPending ? (
              <p className="p-4 text-text-secondary">Loading pending payments...</p>
            ) : pendingPayments.length === 0 ? (
              <div className="py-12 text-center">
                <Clock className="w-12 h-12 text-text-placeholder mx-auto mb-3 opacity-50" />
                <h3 className="text-h4 font-medium text-text-primary mb-1">All Settled Up!</h3>
                <p className="text-text-secondary text-small">No pending payments right now.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-surface-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted border-b border-surface-border text-small text-text-secondary font-medium">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-small text-text-primary divide-y divide-surface-border">
                    {pendingPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-surface-muted/50">
                        <td className="p-4 font-semibold">{p.customerName}</td>
                        <td className="p-4 text-text-secondary">{p.customerMobile}</td>
                        <td className="p-4">{p.planName || <span className="text-text-placeholder">Manual</span>}</td>
                        <td className="p-4 font-semibold text-primary">₹{p.amount}</td>
                        <td className="p-4 text-text-secondary">
                          {new Date(p.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => markAsPaid({ id: p.id })}
                            className="inline-flex items-center gap-1.5 text-xs py-1 px-3 rounded-lg bg-success/10 hover:bg-success/20 text-success font-medium transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Paid
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            loadingAll ? (
              <p className="p-4 text-text-secondary">Loading transactions...</p>
            ) : allPayments.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="w-12 h-12 text-text-placeholder mx-auto mb-3 opacity-50" />
                <h3 className="text-h4 font-medium text-text-primary mb-1">No Transactions Yet</h3>
                <p className="text-text-secondary text-small">Record a payment to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-surface-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted border-b border-surface-border text-small text-text-secondary font-medium">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-small text-text-primary divide-y divide-surface-border">
                    {allPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-surface-muted/50">
                        <td className="p-4">
                          <p className="font-semibold">{p.customerName}</p>
                          <p className="text-caption text-text-secondary">{p.customerMobile}</p>
                        </td>
                        <td className="p-4 text-text-secondary">
                          {new Date(p.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">{p.planName || <span className="text-text-placeholder">Manual</span>}</td>
                        <td className="p-4 font-semibold text-text-primary">₹{p.amount}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              p.status === 'PAID'
                                ? 'bg-success/10 text-success'
                                : 'bg-warning/10 text-warning'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </Card.Body>
      </Card>

      {isModalOpen && <RecordPaymentModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

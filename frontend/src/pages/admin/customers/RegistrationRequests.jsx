import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/axios';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { UserCheck, UserX, Clock, Phone, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RegistrationRequests() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['pending-customers'],
    queryFn: async () => {
      const res = await api.get('/api/admin/customers/pending');
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/api/admin/customers/${id}/approve`);
    },
    onSuccess: () => {
      toast.success('Registration approved successfully');
      queryClient.invalidateQueries(['pending-customers']);
      queryClient.invalidateQueries(['customers']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to approve request');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/api/admin/customers/${id}/reject`);
    },
    onSuccess: () => {
      toast.success('Registration rejected');
      queryClient.invalidateQueries(['pending-customers']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to reject request');
    }
  });

  if (isLoading) return <div className="p-4">Loading requests...</div>;
  if (error) return <div className="p-4 text-danger">Failed to load requests.</div>;

  const requests = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-page-title text-text-primary">Registration Requests</h1>
          <p className="text-small text-text-secondary">Approve or reject customer signups</p>
        </div>
      </div>

      <Card>
        <Card.Body className="p-0">
          {requests.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="w-12 h-12 text-text-placeholder mx-auto mb-3" />
              <h3 className="text-h4 font-medium text-text-primary mb-1">No Pending Requests</h3>
              <p className="text-text-secondary text-small">All customer registrations have been processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-muted border-b border-surface-border text-small text-text-secondary font-medium">
                    <th className="p-4 font-medium text-left">Customer</th>
                    <th className="p-4 font-medium text-left">Mobile</th>
                    <th className="p-4 font-medium text-left">Date Submitted</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-small text-text-primary divide-y divide-surface-border">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            {req.photoUrl ? (
                              <img src={req.photoUrl} alt={req.fullName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{req.fullName}</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning mt-1">
                              Pending
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Phone className="w-4 h-4" />
                          <span>{req.mobileNumber}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => rejectMutation.mutate(req.id)}
                            disabled={rejectMutation.isPending || approveMutation.isPending}
                            className="p-2 text-danger hover:bg-danger/10 rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-danger/20 disabled:opacity-50"
                            title="Reject Request"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => approveMutation.mutate(req.id)}
                            disabled={rejectMutation.isPending || approveMutation.isPending}
                            className="p-2 text-success hover:bg-success/10 rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-success/20 disabled:opacity-50"
                            title="Approve Request"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                        </div>
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

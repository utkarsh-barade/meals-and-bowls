import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import Card from '@/components/ui/Card';
import CustomerForm from '@/components/ui/CustomerForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomer(id),
  });

  const mutation = useMutation({
    mutationFn: (data) => customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customer', id]);
      navigate('/admin/customers');
    },
    onError: (err) => {
      setApiError(err.response?.data?.message || 'Failed to update customer');
    },
  });

  if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading...</div>;
  if (isError) return <div className="p-8 text-center text-danger">Failed to load customer</div>;

  const customer = response?.data;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/admin/customers')} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-page-title text-text-primary">Edit Customer</h1>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Customer Details</Card.Title>
        </Card.Header>
        <Card.Body>
          {apiError && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 text-danger rounded-md text-small">
              {apiError}
            </div>
          )}
          <CustomerForm 
            defaultValues={{
              fullName: customer.fullName,
              mobileNumber: customer.mobileNumber
            }}
            onSubmit={(data) => mutation.mutate(data)} 
            isSubmitting={mutation.isPending} 
            submitLabel="Update Customer"
          />
        </Card.Body>
      </Card>
    </div>
  );
}

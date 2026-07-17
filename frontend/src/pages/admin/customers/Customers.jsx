import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function Customers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['customers', search, page, size],
    queryFn: () => customerService.getCustomers(search, page, size),
    keepPreviousData: true,
  });

  const { mutate: deleteCustomer } = useMutation({
    mutationFn: (id) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete customer. Ensure they have no active subscriptions or payments.');
    }
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      deleteCustomer(id);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearch('');
    setPage(0);
  };

  const customers = response?.data?.content || [];
  const totalPages = response?.data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-page-title text-text-primary">Customers</h1>
        <Button onClick={() => navigate('/admin/customers/new')} className="w-full sm:w-auto flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <Card.Body>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-placeholder" />
              <Input
                placeholder="Search by name or mobile..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
            {search && (
              <Button type="button" variant="secondary" onClick={handleClear}>
                Clear
              </Button>
            )}
          </form>

          {isError ? (
            <div className="text-center py-8 text-danger">Failed to load customers.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Mobile</Table.HeadCell>
                    <Table.HeadCell>Joined Date</Table.HeadCell>
                    <Table.HeadCell className="text-right">Actions</Table.HeadCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {isLoading ? (
                    <Table.Row>
                      <Table.Cell colSpan={4} className="text-center py-8 text-text-secondary">Loading...</Table.Cell>
                    </Table.Row>
                  ) : customers.length === 0 ? (
                    <Table.Empty colSpan={4} message="No customers found." />
                  ) : (
                    customers.map((customer) => (
                      <Table.Row key={customer.id}>
                        <Table.Cell className="font-medium">
                          <div className="flex items-center gap-3">
                            {customer.photoUrl ? (
                              <img 
                                src={customer.photoUrl.startsWith('blob:') ? customer.photoUrl : `${import.meta.env.VITE_API_BASE_URL || ''}${customer.photoUrl}`} 
                                alt={customer.fullName} 
                                className="w-8 h-8 rounded-full object-cover bg-surface-muted" 
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                                {customer.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {customer.fullName}
                          </div>
                        </Table.Cell>
                        <Table.Cell>{customer.mobileNumber}</Table.Cell>
                        <Table.Cell>{new Date(customer.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" className="p-2" onClick={() => navigate(`/admin/customers/${customer.id}`)}>
                              <Eye className="w-4 h-4 text-info" />
                            </Button>
                            <Button variant="ghost" className="p-2" onClick={() => navigate(`/admin/customers/${customer.id}/edit`)}>
                              <Edit className="w-4 h-4 text-text-secondary" />
                            </Button>
                            <Button variant="ghost" className="p-2 hover:bg-danger/10" onClick={() => handleDelete(customer.id, customer.fullName)}>
                              <Trash2 className="w-4 h-4 text-danger" />
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 border-t pt-4">
              <Button 
                variant="secondary" 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || isLoading}
              >
                Previous
              </Button>
              <span className="text-small text-text-secondary">
                Page {page + 1} of {totalPages}
              </span>
              <Button 
                variant="secondary" 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

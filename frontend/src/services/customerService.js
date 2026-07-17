import axiosInstance from './axios';

export const customerService = {
  getCustomers: async (search = '', page = 0, size = 10) => {
    const params = { search, page, size };
    const response = await axiosInstance.get('/api/admin/customers', { params });
    return response.data;
  },

  getCustomer: async (id) => {
    const response = await axiosInstance.get(`/api/admin/customers/${id}`);
    return response.data;
  },

  createCustomer: async (data) => {
    const response = await axiosInstance.post('/api/admin/customers', data);
    return response.data;
  },

  updateCustomer: async (id, data) => {
    const response = await axiosInstance.put(`/api/admin/customers/${id}`, data);
    return response.data;
  },

  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(`/api/admin/customers/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteCustomer: async (id) => {
    const response = await axiosInstance.delete(`/api/admin/customers/${id}`);
    return response.data;
  },
};

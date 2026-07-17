import axios from './axios';

export const paymentService = {
  getPayments: async () => {
    return axios.get('/api/admin/payments');
  },

  getPendingPayments: async () => {
    return axios.get('/api/admin/payments/pending');
  },

  getCustomerPayments: async (customerId) => {
    return axios.get(`/api/admin/payments/customer/${customerId}`);
  },

  recordPayment: async (paymentData) => {
    return axios.post('/api/admin/payments', paymentData);
  },

  updatePaymentStatus: async (paymentId, status) => {
    return axios.put(`/api/admin/payments/${paymentId}/status?status=${status}`);
  }
};

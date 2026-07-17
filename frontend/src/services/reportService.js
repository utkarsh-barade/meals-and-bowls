import axios from './axios';

export const reportService = {
  getDashboardStats: async () => {
    return axios.get('/api/admin/reports/dashboard');
  },

  getDailyMealReport: async (date) => {
    const params = date ? `?date=${date}` : '';
    return axios.get(`/api/admin/reports/daily-meals${params}`);
  },

  getCustomerMealReport: async (customerId) => {
    return axios.get(`/api/admin/reports/customer-meals/${customerId}`);
  },

  getExpiringPlans: async (days = 7) => {
    return axios.get(`/api/admin/reports/expiring-plans?days=${days}`);
  },

  getPendingPayments: async () => {
    return axios.get('/api/admin/reports/pending-payments');
  },
};

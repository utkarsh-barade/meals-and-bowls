import axios from './axios';

export const subscriptionService = {
  getPlans: async () => {
    return axios.get('/api/admin/plans');
  },
  
  getActiveSubscription: async (customerId) => {
    return axios.get(`/api/admin/customers/${customerId}/subscriptions/active`);
  },

  assignPlan: async (customerId, payload) => {
    return axios.post(`/api/admin/customers/${customerId}/subscriptions`, payload);
  }
};

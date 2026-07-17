import api from './axios';

export const customerPortalService = {
  getDashboard: async () => {
    const res = await api.get('/api/customer/dashboard');
    return res.data;
  },
  
  getMealHistory: async () => {
    const res = await api.get('/api/customer/meals');
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/api/customer/profile');
    return res.data;
  }
};

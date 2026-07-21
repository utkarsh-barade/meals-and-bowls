import axios from './axios';

export const mealService = {
  serveMeal: async (customerId, date, mealType) => {
    return axios.post(`/api/admin/meals/serve/${customerId}`, { date, mealType });
  },
  
  correctMeal: async (customerId, date, mealType, isServed) => {
    return axios.post(`/api/admin/meals/correct/${customerId}`, { date, mealType, isServed });
  },

  getMealHistory: async (customerId, startDate, endDate) => {
    return axios.get(`/api/admin/meals/history/${customerId}`, {
      params: { startDate, endDate }
    });
  },

  getMealManagementList: async (search) => {
    return axios.get('/api/admin/meals/management-list', {
      params: { search }
    });
  }
};

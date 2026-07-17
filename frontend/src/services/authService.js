import api from './axios';

/**
 * Auth API calls — wired to backend /api/auth endpoints.
 */
export const authService = {
  /**
   * Admin login.
   * @param {{ mobile: string, password: string }} data
   * @returns {Promise<{token, role, name, mobile}>}
   */
  adminLogin: async (data) => {
    const res = await api.post('/api/auth/admin/login', data);
    return res.data.data; // unwrap ApiResponse
  },

  /**
   * Customer login.
   * @param {{ mobile: string, password: string }} data
   */
  customerLogin: async (data) => {
    const res = await api.post('/api/auth/customer/login', data);
    return res.data.data;
  },

  /**
   * Customer self-registration.
   * @param {{ fullName: string, mobile: string, password: string, confirmPassword: string }} data
   */
  customerRegister: async (data) => {
    const res = await api.post('/api/auth/customer/register', data);
    return res.data.data;
  },
};

import api from '../api/axiosConfig'; // On importe la config qu'on vient de créer
import type { LoginResponse, User } from '../types/user';

export const userService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  
  register: async (userData: any): Promise<void> => {
    await api.post('/users/register', userData);
  }
};
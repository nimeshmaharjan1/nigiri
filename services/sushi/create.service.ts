import { api } from '@/lib/axios';
import { T_Sushi } from '@/types/sushi.types';

export const createSushi = async (data: Omit<T_Sushi, 'id' | 'createdAt'>) => {
  const response = await api.post('/sushi', data);
  return response.data as T_Sushi;
};

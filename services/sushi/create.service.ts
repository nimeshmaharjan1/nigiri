import { api } from '@/lib/axios';
import { T_CreateSushi, T_Sushi } from '@/types/sushi.types';

export const createSushi = async (data: T_CreateSushi) => {
  const response = await api.post('/sushi', data);
  return response.data as T_Sushi;
};

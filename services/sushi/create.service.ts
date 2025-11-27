import { api } from '@/lib/axios';
import { SushiType } from '@/types/sushi.types';

export const createSushi = async (
  data: Omit<SushiType, 'id' | 'createdAt'>
) => {
  const response = await api.post('/sushi', data);
  return response.data as SushiType;
};

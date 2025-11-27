import { api } from '@/lib/axios';
import { SushiType } from '@/types/sushi.types';

export const getAllSushi = async () => {
  const response = await api.get('/sushi');
  return response.data as SushiType[];
};

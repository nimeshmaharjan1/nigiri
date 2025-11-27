import { api } from '@/lib/axios';
import { T_Sushi } from '@/types/sushi.types';

export const getOneSushi = async (id: string) => {
  const response = await api.get(`/sushi/${id}`);
  return response.data as T_Sushi;
};

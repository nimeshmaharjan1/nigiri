import { api } from '@/lib/axios';
import { T_Sushi } from '@/types/sushi.types';

export const deleteSushi = async (id: string) => {
  const response = await api.delete(`/sushi/${id}`);
  return response.data as T_Sushi;
};

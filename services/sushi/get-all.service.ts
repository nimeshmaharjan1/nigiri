import { api } from '@/lib/axios';
import { sushiListSchema, T_Sushi } from '@/types/sushi.types';

export const getAllSushi = async () => {
  const response = await api.get('/sushi');
  const validatedData = sushiListSchema.parse(response.data);
  return validatedData as T_Sushi[];
};

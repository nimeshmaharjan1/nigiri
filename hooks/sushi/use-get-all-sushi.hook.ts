import { getAllSushi } from '@/services/sushi/get-all.service';
import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

// Return type of your API
type QueryResponse = Awaited<ReturnType<typeof getAllSushi>>;

interface QueryProps
  extends Omit<
    UseQueryOptions<QueryResponse, Error, QueryResponse>,
    'queryKey' | 'queryFn'
  > {
  deps?: string[];
}
export const GET_ALL_SUSHI_QUERY_KEY = 'get-all-sushi';
const useGetAllSushi = ({ deps, ...options }: QueryProps) => {
  return useQuery<QueryResponse, Error>({
    queryKey: [GET_ALL_SUSHI_QUERY_KEY, deps],
    queryFn: () => getAllSushi(),
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useGetAllSushi;

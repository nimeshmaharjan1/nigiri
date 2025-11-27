import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Example hook - replace with your actual API calls
export function useExampleQuery() {
  return useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      const response = await fetch('/api/example');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });
}

// Example mutation hook
export function useExampleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to mutate');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['example'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreateInitiativeData } from '@/lib/types';

export function useInitiatives(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['initiatives', params],
    queryFn: () => api.getInitiatives(params),
  });
}

export function useInitiative(id: string) {
  return useQuery({
    queryKey: ['initiative', id],
    queryFn: () => api.getInitiative(id),
    enabled: !!id,
  });
}

export function useCreateInitiative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInitiativeData) => api.createInitiative(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreatePledgeData } from '@/lib/types';

export function useCreatePledge(initiativeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePledgeData) => api.createPledge(initiativeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiative', initiativeId] });
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    },
  });
}

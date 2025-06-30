import { useQuery } from 'react-query';
import { apiClient } from '@/lib/api';

export function useTeamMembers(teamId: string | undefined) {
  return useQuery(
    ['teamMembers', teamId],
    async () => {
      if (!teamId) return [];
      const res = await apiClient.getTeam(teamId);
      return res.data?.data?.members || [];
    },
    { enabled: !!teamId }
  );
} 
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTeamStore } from '@/stores/teamStore';
import { api } from '@/lib/api';

export function useTeams() {
  const { setTeams, clearSelectedTeamIfInvalid } = useTeamStore();
  
  const { data: teams, isLoading, isError, refetch } = useQuery(
    'teams',
    async () => {
      const response = await api.get('/api/teams');
      return response.data.data;
    },
    {
      onSuccess: (data) => {
        setTeams(data);
        clearSelectedTeamIfInvalid();
      },
      onError: (error) => {
        console.error('Error fetching teams:', error);
      }
    }
  );

  return {
    teams,
    loading: isLoading,
    error: isError,
    refetch
  };
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { addTeam } = useTeamStore();

  return useMutation(
    async (teamData: any) => {
      const response = await api.post('/api/teams', teamData);
      return response.data.data;
    },
    {
      onSuccess: (newTeam) => {
        queryClient.invalidateQueries('teams');
        addTeam(newTeam);
      },
      onError: (error) => {
        console.error('Error creating team:', error);
      }
    }
  );
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  const { updateTeam } = useTeamStore();

  return useMutation(
    async ({ teamId, updates }: { teamId: string; updates: any }) => {
      const response = await api.put(`/teams/${teamId}`, updates);
      return response.data.data;
    },
    {
      onSuccess: (updatedTeam) => {
        queryClient.invalidateQueries('teams');
        updateTeam(updatedTeam._id, updatedTeam);
      },
      onError: (error) => {
        console.error('Error updating team:', error);
      }
    }
  );
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  const { removeTeam } = useTeamStore();

  return useMutation(
    async (teamId: string) => {
      await api.delete(`/teams/${teamId}`);
      return teamId;
    },
    {
      onSuccess: (teamId) => {
        queryClient.invalidateQueries('teams');
        removeTeam(teamId);
      },
      onError: (error) => {
        console.error('Error deleting team:', error);
      }
    }
  );
} 
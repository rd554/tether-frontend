import { useQuery } from 'react-query';
import { api } from '@/lib/api';

export function useDashboardData() {
  return useQuery(
    'dashboard-overview',
    async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tether_token') || '' : '';
      
      // If no token, redirect to home immediately
      if (!token) {
        window.location.href = '/';
        throw new Error('No authentication token');
      }
      
      try {
        const response = await api.get('/api/dashboard/overview', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
      } catch (error: any) {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          // Clear localStorage and redirect to home
          localStorage.removeItem('tether_token');
          window.location.href = '/';
          throw new Error('Authentication failed');
        }
        throw error;
      }
    },
    {
      staleTime: 0, // Always consider data stale, so it refetches immediately
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error: any) => {
        // Additional error handling for network errors
        if (error.message === 'Authentication failed' || error.message === 'No authentication token') {
          // Already handled above, just log
          console.log('Authentication error handled');
        } else {
          console.error('Dashboard data error:', error);
        }
      }
    }
  );
}

export function useTeamDashboard(teamId: string) {
  return useQuery(
    ['team-dashboard', teamId],
    async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tether_token') || '' : '';
      
      // If no token, redirect to home immediately
      if (!token) {
        window.location.href = '/';
        throw new Error('No authentication token');
      }
      
      try {
        const response = await api.get(`/api/dashboard/team/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
      } catch (error: any) {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          // Clear localStorage and redirect to home
          localStorage.removeItem('tether_token');
          window.location.href = '/';
          throw new Error('Authentication failed');
        }
        throw error;
      }
    },
    {
      enabled: !!teamId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error: any) => {
        if (error.message === 'Authentication failed' || error.message === 'No authentication token') {
          console.log('Authentication error handled');
        } else {
          console.error('Team dashboard error:', error);
        }
      }
    }
  );
}

export function useCXODashboard() {
  return useQuery(
    'cxo-dashboard',
    async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tether_token') || '' : '';
      
      // If no token, redirect to home immediately
      if (!token) {
        window.location.href = '/';
        throw new Error('No authentication token');
      }
      
      try {
        const response = await api.get('/api/dashboard/cxo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.data;
      } catch (error: any) {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          // Clear localStorage and redirect to home
          localStorage.removeItem('tether_token');
          window.location.href = '/';
          throw new Error('Authentication failed');
        }
        throw error;
      }
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error: any) => {
        if (error.message === 'Authentication failed' || error.message === 'No authentication token') {
          console.log('Authentication error handled');
        } else {
          console.error('CXO dashboard error:', error);
        }
      }
    }
  );
} 
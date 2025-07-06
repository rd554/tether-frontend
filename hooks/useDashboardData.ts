import { useEffect, useState, useRef } from 'react';
import { apiClient } from '@/lib/api';

interface DashboardDataOptions {
  refetchInterval?: number;
}

export function useDashboardData(options?: DashboardDataOptions) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.getDashboardOverview();
      setData(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (options?.refetchInterval) {
      intervalRef.current = setInterval(fetchData, options.refetchInterval);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [options?.refetchInterval]);

  return { data, isLoading, error, refetch: fetchData };
} 
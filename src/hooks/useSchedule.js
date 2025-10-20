import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getScheduleForWeek } from '../data/mockData';
import React from 'react';

export const useSchedule = (weekOffset = 0) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['schedule', weekOffset],
    queryFn: () => getScheduleForWeek(weekOffset),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });

  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['schedule', weekOffset + 1],
      queryFn: () => getScheduleForWeek(weekOffset + 1),
    });
  }, [weekOffset, queryClient]);

  return query;
};

import { useQuery } from '@tanstack/react-query';
import { getScheduleForWeek } from '../data/mockData';

export const useSchedule = (weekOffset = 0) => {
  return useQuery({
    queryKey: ['schedule', weekOffset],
    queryFn: () => getScheduleForWeek(weekOffset),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const getBookings = () => {
  return JSON.parse(localStorage.getItem('bookings') || '[]');
};

const addBooking = (booking) => {
  const bookings = getBookings();
  const newBookings = [...bookings, booking];
  localStorage.setItem('bookings', JSON.stringify(newBookings));
  return newBookings;
};

const removeBooking = (bookingId) => {
  const bookings = getBookings();
  const filteredBookings = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem('bookings', JSON.stringify(filteredBookings));
  return filteredBookings;
};

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    staleTime: 1 * 60 * 1000,
  });
};

export const useAddBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBooking,
    onMutate: async (newBooking) => {
      await queryClient.cancelQueries({ queryKey: ['bookings'] });
      
      const previousBookings = queryClient.getQueryData(['bookings']);
      
      queryClient.setQueryData(['bookings'], (old) => 
        old ? [...old, newBooking] : [newBooking]
      );

      return { previousBookings };
    },
    onError: (err, newBooking, context) => {
      queryClient.setQueryData(['bookings'], context.previousBookings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useRemoveBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

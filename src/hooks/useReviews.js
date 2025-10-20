import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, createReview, updateReview, deleteReview } from '../services/api';

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onMutate: async (newReview) => {
      await queryClient.cancelQueries({ queryKey: ['reviews'] });
      
      const previousReviews = queryClient.getQueryData(['reviews']);
      
      const optimisticReview = {
        id: Date.now(),
        ...newReview,
        localId: Date.now(),
      };

      queryClient.setQueryData(['reviews'], (old) => 
        old ? [...old, optimisticReview] : [optimisticReview]
      );

      return { previousReviews };
    },
    onError: (err, newReview, context) => {
      queryClient.setQueryData(['reviews'], context.previousReviews);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['reviews'] });
      
      const previousReviews = queryClient.getQueryData(['reviews']);
      
      queryClient.setQueryData(['reviews'], (old) => 
        old ? old.filter(review => review.id !== deletedId) : []
      );

      return { previousReviews };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(['reviews'], context.previousReviews);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

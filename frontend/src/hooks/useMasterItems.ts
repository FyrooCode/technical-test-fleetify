import { useQuery } from '@tanstack/react-query';
import { itemsService } from '@/services/items.service';
import toast from 'react-hot-toast';

export const useMasterItems = () => {
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['master-items'],
    queryFn: async () => {
      try {
        return await itemsService.getAll();
      } catch (err) {
        const error = err as Error;
        toast.error('Failed to load master items. Please try again.');
        throw error;
      }
    },
  });

  return {
    items,
    isLoading,
    error: error as Error | null,
  };
};

import api from '@/lib/axios';

export interface Item {
  id: number;
  code: string;
  name: string;
  price: number;
}

interface ItemsResponse {
  status: string;
  data: Item[];
  meta: {
    total_results: number;
    timestamp: string;
  };
}

export const itemsService = {
  /**
   * Search items by code (query parameter)
   * @param code - The item code to search for
   * @param signal - Optional AbortSignal for cancellation
   */
  searchByCode: async (code: string, signal?: AbortSignal): Promise<Item[]> => {
    const response = await api.get<ItemsResponse>(`/items?code=${code}`, { signal });
    const data = response.data.data;
    return Array.isArray(data) ? data : data ? [data] : [];
  },

  /**
   * Get all items
   */
  getAll: async (signal?: AbortSignal): Promise<Item[]> => {
    const response = await api.get<ItemsResponse>('/items', { signal });
    return response.data.data;
  },
};

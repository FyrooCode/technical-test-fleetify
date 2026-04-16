import { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { itemsService } from '@/services/items.service';
import { Item } from '@/types';

export const useStep2Items = () => {
  const { details, setDetails, setStep } = useInvoiceStore();
  const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>({});
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  const abortControllerRef = useRef<{ [key: number]: AbortController }>({});
  const debounceTimerRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = debounceTimerRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const addRow = () => {
    setDetails([...details, { item_id: 0, code: '', name: '', quantity: 1, price: 0, subtotal: 0 }]);
  };

  const removeRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
    // Clean up query state for removed row
    setSearchQueries(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const { data: searchResults = {} } = useQuery({
    queryKey: ['items', searchQueries],
    queryFn: async () => {
      const results: { [key: number]: Item[] } = {};
      
      // Run all active queries in parallel (including empty queries for fetch-all)
      const promises = Object.entries(searchQueries)
        .map(async ([index, query]) => {
          try {
            const idx = parseInt(index, 10);
            if (abortControllerRef.current[idx]) {
              abortControllerRef.current[idx].abort();
            }
            const controller = new AbortController();
            abortControllerRef.current[idx] = controller;
            
            // If query is empty, fetch first 10 items; otherwise search
            const data = query.trim() === '' 
              ? await itemsService.getAll(controller.signal).then((items: Item[]) => items.slice(0, 10))
              : await itemsService.searchByCode(query, controller.signal);
            results[idx] = data.slice(0, 5);
          } catch (err) {
            const error = err as { name: string };
            if (error.name !== 'CanceledError') {
              console.error(err);
              toast.error('Failed to search items. Please try again.');
            }
            results[parseInt(index, 10)] = [];
          }
        });

      await Promise.all(promises);
      return results;
    },
    enabled: Object.keys(searchQueries).length > 0,
    staleTime: 0,
  });

  const handleInputChange = useCallback((index: number, value: string) => {
    const newDetails = [...details];
    newDetails[index].code = value;
    
    if (newDetails[index].item_id !== 0) {
      newDetails[index].item_id = 0;
      newDetails[index].name = '';
      newDetails[index].price = 0;
      newDetails[index].subtotal = 0;
    }
    
    setDetails(newDetails);
    
    // Debounce search query update
    if (debounceTimerRef.current[index]) {
      clearTimeout(debounceTimerRef.current[index]);
    }

    debounceTimerRef.current[index] = setTimeout(() => {
      setSearchQueries(prev => ({
        ...prev,
        [index]: value,
      }));
    }, 500);
  }, [details, setDetails]);

  const selectItem = (index: number, item: Item) => {
    const newDetails = [...details];
    newDetails[index] = {
      ...newDetails[index],
      item_id: item.id,
      code: item.code,
      name: item.name,
      price: item.price,
      subtotal: newDetails[index].quantity * item.price
    };
    setDetails(newDetails);
    setActiveDropdown(null);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const q = Math.max(1, quantity || 0);
    const newDetails = [...details];
    newDetails[index].quantity = q;
    newDetails[index].subtotal = q * newDetails[index].price;
    setDetails(newDetails);
  };

  // Determine loading state for each row
  const loadingMap: { [key: number]: boolean } = {};
  Object.keys(searchQueries).forEach((index) => {
    loadingMap[parseInt(index, 10)] = false; // useQuery handles loading internally
  });

  const fetchItems = (index: number, query: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [index]: query,
    }));
  };

  return {
    details,
    searchResults,
    loadingMap,
    activeDropdown,
    containerRef,
    addRow,
    removeRow,
    handleInputChange,
    handleQuantityChange,
    selectItem,
    setActiveDropdown,
    fetchItems,
    setStep,
  };
};

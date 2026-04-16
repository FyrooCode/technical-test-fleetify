import { useState, useRef, useEffect } from 'react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { itemsService } from '@/services/items.service';

export const useStep2Items = () => {
  const { details, setDetails, setStep } = useInvoiceStore();
  const [searchResults, setSearchResults] = useState<{ [key: number]: any[] }>({});
  const [loadingMap, setLoadingMap] = useState<{ [key: number]: boolean }>({});
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  const abortControllerRef = useRef<{ [key: number]: AbortController }>({});
  const debounceTimerRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      Object.values(debounceTimerRef.current).forEach(clearTimeout);
    };
  }, []);

  const addRow = () => {
    setDetails([...details, { item_id: 0, code: '', name: '', quantity: 1, price: 0, subtotal: 0 }]);
  };

  const removeRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const fetchItems = async (index: number, query: string) => {
    if (abortControllerRef.current[index]) {
      abortControllerRef.current[index].abort();
    }

    const controller = new AbortController();
    abortControllerRef.current[index] = controller;
    setLoadingMap(prev => ({ ...prev, [index]: true }));

    try {
      const data = await itemsService.searchByCode(query, controller.signal);
      
      setSearchResults(prev => ({ 
        ...prev, 
        [index]: data.slice(0, 5)
      }));
    } catch (err: any) {
      if (err.name !== 'CanceledError') console.error(err);
    } finally {
      setLoadingMap(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newDetails = [...details];
    newDetails[index].code = value;
    
    if (newDetails[index].item_id !== 0) {
      newDetails[index].item_id = 0;
      newDetails[index].name = '';
      newDetails[index].price = 0;
      newDetails[index].subtotal = 0;
    }
    
    setDetails(newDetails);

    if (debounceTimerRef.current[index]) {
      clearTimeout(debounceTimerRef.current[index]);
    }

    debounceTimerRef.current[index] = setTimeout(() => {
      fetchItems(index, value);
    }, 500); 
  };

  const selectItem = (index: number, item: any) => {
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
    setSearchResults(prev => ({ ...prev, [index]: [] }));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const q = Math.max(1, quantity || 0);
    const newDetails = [...details];
    newDetails[index].quantity = q;
    newDetails[index].subtotal = q * newDetails[index].price;
    setDetails(newDetails);
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

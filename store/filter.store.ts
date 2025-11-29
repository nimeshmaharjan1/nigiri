import { T_SushiType } from '@/types/sushi.types';
import { create } from 'zustand';

interface FilterState {
  // Filter values
  searchQuery: string;
  typeFilter: 'all' | T_SushiType;
  priceRange: [number, number];

  // Sort options
  priceSort: 'none' | 'asc' | 'desc';
  nameSort: 'none' | 'asc' | 'desc';

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: 'all' | T_SushiType) => void;
  setPriceRange: (range: [number, number]) => void;
  setPriceSort: (sort: 'none' | 'asc' | 'desc') => void;
  setNameSort: (sort: 'none' | 'asc' | 'desc') => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  typeFilter: 'all' as const,
  priceRange: [0, 100] as [number, number],
  priceSort: 'asc' as const,
  nameSort: 'asc' as const,
  currentPage: 1,
  itemsPerPage: 10,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setTypeFilter: (type) => set({ typeFilter: type, currentPage: 1 }),
  setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }),
  setPriceSort: (sort) => set({ priceSort: sort, currentPage: 1 }),
  setNameSort: (sort) => set({ nameSort: sort, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  resetFilters: () => set(initialState),
}));

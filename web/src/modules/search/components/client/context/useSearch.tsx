'use client';

import { create } from 'zustand';

import axios from '@web/src/lib/axios';

type SearchState = {
  fetchSearchResults: (
    query: string,
    page: number,
    limit: number,
  ) => Promise<void>;
  query: string;
  page: number;
  limit: number;
  results: any[];
  isLoading: boolean;
};

export const useSearch = create<SearchState>((set, get) => {
  const fetchSearchResults = async (
    query: string,
    page: number,
    limit: number,
  ) => {
    set({ isLoading: true });

    const result = await axios.get('/user', {
      params: {
        query: query,
        page: page,
        limit: limit,
      },
    });

    set({
      query,
      page,
      limit,
      results: result.data,
      isLoading: false,
    });
  };

  return {
    fetchSearchResults,
    query: '',
    page: 1,
    limit: 20,
    results: [],
    isLoading: false,
  };
});

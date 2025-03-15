'use client';

import { PageResultDTO } from '@shared/validation/common/dto/PageResult.dto';
import { UserSearchViewDto } from '@shared/validation/user/dto/UserSearchView.dto';
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
  data: UserSearchViewDto[];
  isLoading: boolean;
};

export const useSearch = create<SearchState>((set) => {
  const fetchSearchResults = async (
    query: string,
    page: number,
    limit: number,
  ) => {
    set({ isLoading: true });

    const result = await axios.get<PageResultDTO<UserSearchViewDto>>('/user', {
      params: {
        query: query,
        page: page,
        limit: limit,
      },
    });

    const { data } = result;

    set({
      query: query,
      page: data.page,
      limit: data.limit,
      data: data.data,
      isLoading: false,
    });
  };

  return {
    fetchSearchResults,
    query: '',
    page: 1,
    limit: 20,
    data: [],
    isLoading: false,
  };
});

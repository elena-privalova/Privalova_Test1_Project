import { create } from 'zustand';

import api from '../adapter';
import createSelectors from '../selectors';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { useUserStoreBase } from '..';

export type PaginationState = {
  activePage: number,
  finalPage: number,
  endPage: number,
  countPages: number,
  pagesArray: number[],
  error: string
};

type PaginationActions = {
  setActivePage: (numberPage: number) =>  void,
  setFinalPage: (numberPage: number) =>  void,
  setEndPage: (numberPage: number) => void,
  setCountPages: (countNewPages?: number) => Promise<void>,
  reset: () => void
};

const initialPaginationState = {
  activePage: 1,
  finalPage: 1,
  endPage: 0,
  countPages: 0,
  pagesArray: [],
  error: ''
};

export const usePaginationStoreBase = create<PaginationState & PaginationActions>()((set, get) => ({
  ...initialPaginationState,
  setActivePage: (numberPage: number) => {
    set({ activePage: numberPage });
  },
  setFinalPage: (numberPage: number) => {
    set({ finalPage: numberPage });
  },
  setEndPage: (numberPage: number) => {
    set({ endPage: numberPage });
  },
  setCountPages: async (countNewPages?: number) => {
    const isSearch = useUserStoreBase.getState().isSearch;

    try {
      if (countNewPages == undefined) {
        const { data } = await api.get('users');

        const initialCount = Math.ceil(data.users.length / COUNT_USERS_ON_PAGE);

        set({
          countPages: initialCount,
          finalPage: initialCount
        });
        return;
      }

      const newCount = Math.ceil(countNewPages / COUNT_USERS_ON_PAGE);
      const pagesCount = get().countPages;

      if (isSearch && pagesCount === 0) {
        set({
          countPages: newCount,
          finalPage: newCount
        });
        return;
      }

      if (Math.abs(pagesCount - get().finalPage) < 1) {
        set({ countPages: pagesCount + newCount });
      }

    } catch(e) {
      set({ error: 'Failed to get users' });
    }
  },
  reset: () => {
    set(initialPaginationState);
  }
}));

export const usePaginatonStore = createSelectors(usePaginationStoreBase);


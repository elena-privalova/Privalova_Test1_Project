import { create } from 'zustand';

import api from '../adapter';
import createSelectors from '../selectors';
import { COUNT_USERS_ON_PAGE } from '../../constants';

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
};

export const usePaginationStoreBase = create<PaginationState & PaginationActions>()((set, get) => ({
  activePage: 1,
  finalPage: 3,
  endPage: 0,
  countPages: 0,
  pagesArray: [],
  error: '',
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
    try {
      if (countNewPages == undefined) {
        const { data } = await api.get('users');

        set({ countPages: data.users.length / COUNT_USERS_ON_PAGE });
        return;
      }

      if (Math.abs(get().countPages - get().finalPage) < 1) {
        set({ countPages: get().countPages + countNewPages / COUNT_USERS_ON_PAGE });
      }
    } catch(e) {
      set({ error: 'Failed to get users' });
    }
  }
}));

export const usePaginatonStore = createSelectors(usePaginationStoreBase);


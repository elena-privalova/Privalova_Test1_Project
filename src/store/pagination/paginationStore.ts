import { create } from 'zustand';

import api from '../adapter';
import { COUNT_USERS_ON_PAGE } from '../../constants';

export type PaginationState = {
  activePage: number,
  finalPage: number,
  endPage: number,
  countPages: number,
  error: string,
  setActivePage: (numberPage: number) =>  void,
  setFinalPage: (numberPage: number) =>  void,
  setEndPage: (numberPage: number) => void,
  getCountPages: (countNewPages?: number) => Promise<void>,
};

export const usePaginationStore = create<PaginationState>((set, get) => ({
  activePage: 1,
  finalPage: 3,
  endPage: 0,
  countPages: 0,
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
  getCountPages: async (countNewPages?: number) => {
    try {
      if (countNewPages == undefined) {
        const { data } = await api.get('users');

        set({ countPages: data.users.length / COUNT_USERS_ON_PAGE });
        return;
      }

      set({ countPages: get().countPages + countNewPages / COUNT_USERS_ON_PAGE });
    } catch(e) {
      set({ error: 'Failed to get users' });
    }
  }
}));


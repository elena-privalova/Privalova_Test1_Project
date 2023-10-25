import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { usePaginationStoreBase } from '..';
import api from '../adapter';
import createSelectors from '../selectors';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { getIntervalIds } from '../../utils/getIntervalIds';

import { UserData } from './types';

export type UserState = {
  isLoading: boolean,
  isHasMoreUsers: boolean,
  currentUser: number,
  users: UserData[],
  countsUsersPosts: number[],
  usersError: string,
  countsPostsError: string,
  selectedUsersIds: number[],
  error: string
}

type UserActions = {
  getSliceUsers: () => Promise<void>,
  getIsHasMoreUsers: () => Promise<void>,
  getCountsUsersPosts: (users: UserData[]) => Promise<void>,
  setCurrentUser: (userId: number) => void,
  setSelectedUsersIds: (ids: number | number[] | string) => void
};

export const useUserStoreBase = create<UserState & UserActions>((set, get) => ({
  isLoading: false,
  isHasMoreUsers: true,
  currentUser: 0,
  users: [],
  countsUsersPosts: [],
  usersError: '',
  countsPostsError: '',
  selectedUsersIds: [],
  error: '',
  getIsHasMoreUsers: async () => {
    try {
      const finalPage = usePaginationStoreBase.getState().finalPage;
      const setEndPage = usePaginationStoreBase.getState().setEndPage;
      const setCountPages = usePaginationStoreBase.getState().setCountPages;

      const params = new URLSearchParams({
        limit: `${COUNT_USERS_ON_PAGE}`,
        skip: `${(finalPage) * COUNT_USERS_ON_PAGE}`
      });

      const { data } = await api
        .get(`users?${params.toString()}`);

      if (data.users.length === 0) {
        setEndPage(finalPage);
        set({ isHasMoreUsers: false });
        return;
      }

      set({ isHasMoreUsers: true });

      setCountPages(data.users.length);
    } catch (e) {
      set({ error: 'Failed to get users' });
    }
  },
  getSliceUsers: async () => {
    set({ isLoading: true });

    try {
      const activePage = usePaginationStoreBase.getState().activePage;

      const params = new URLSearchParams({
        limit: `${COUNT_USERS_ON_PAGE}`,
        skip: `${(activePage - 1) * COUNT_USERS_ON_PAGE}`
      });

      const { data } = await api
        .get(`users?${params.toString()}`);
      await get().getCountsUsersPosts(data.users);

      set({
        isLoading: false,
        users: data.users,
        usersError: '',
        error: ''
      });

      if (activePage !== 2) get().getIsHasMoreUsers();
    } catch (e) {
      if (e instanceof AxiosError) {
        set({ usersError: e.message });
        toast.error(e.message);
        return;
      }
      set({ error: 'Failed to get users' });
    }
  },
  getCountsUsersPosts: async (users: UserData[]) => {
    try {
      const countsPosts = await Promise.all(users.map((user) => {
        return api.get(`users/${user.id}/posts`).then((res) => res.data.total);
      }));

      set({
        countsUsersPosts: countsPosts,
        countsPostsError: '',
        error: ''
      });
    } catch(e) {
      if (e instanceof AxiosError) {
        set({ countsPostsError: e.message });
        toast.error(e.message);
        return;
      }
      set({ error: 'Failed to count posts' });
    }
  },
  setCurrentUser: (userId) => {
    set({ currentUser: userId });
  },
  setSelectedUsersIds: (ids: number | number[] | string) => {
    if (Array.isArray(ids)) {
      if (ids.length === 2) {
        const selectedIds = getIntervalIds(ids, get().users);
        set({ selectedUsersIds: selectedIds });
        return;
      }

      set({ selectedUsersIds: ids });
      return;
    }

    if (typeof ids === 'number') {
      if (ids === -1) {
        set({ selectedUsersIds: [] });
        return;
      }

      set({ selectedUsersIds: [...get().selectedUsersIds, ids] });
      return;
    }

    const arrayIds = ids.split(',');

    const selectedIds = arrayIds.reduce((acc: number[], id) => {
      if (id.includes('-')) {
        const currentInterval = id.split('-').map((elem) => Number(elem));
        const currentIds = getIntervalIds(currentInterval, get().users);

        return [...acc, ...currentIds];
      }

      return [...acc, Number(id)];
    }, []);

    set({ selectedUsersIds:  selectedIds });
  }
}));

export const useUserStore = createSelectors(useUserStoreBase);


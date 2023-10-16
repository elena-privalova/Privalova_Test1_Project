import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import api from '../adapter';
import { usePostsStore } from '../posts/postsStore';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { getIntervalIds } from '../../utils/getIntervalIds';

import { UserData } from './types';

export type UserState = {
  isLoading: boolean,
  startUser: number,
  currentUser: number,
  users: UserData[],
  countUsers: number,
  countsUsersPosts: number[],
  usersError: string,
  countsPostsError: string,
  selectedUsersIds: number[],
  error: string,
  getCountUsers: () => Promise<void>,
  getSliceUsers: (isCheckNewUsers?: boolean) => Promise<void>,
  getCountsUsersPosts: (users: UserData[]) => Promise<void>,
  setCurrentUser: (userId: number) => void;
  setStartUser: (userId: number) => void,
  setSelectedUsersIds: (ids: number[] | string) => void,
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoading: false,
  startUser: 0,
  currentUser: 0,
  users: [],
  countUsers: 0,
  countsUsersPosts: [],
  usersError: '',
  countsPostsError: '',
  selectedUsersIds: [],
  error: '',
  getCountUsers: async () => {
    set({ isLoading: true });

    try {
      const { data } = await api.get('users');

      set({ countUsers: data.users.length });
    } catch(e) {
      if (e instanceof AxiosError) {
        set({ usersError: e.message });
        return;
      }
      set({ error: 'Failed to get users' });
    }
  },
  getSliceUsers: async (isCheckNewUsers?: boolean) => {
    set({ isLoading: true });

    try {
      if (isCheckNewUsers) {
        const finalPage = usePostsStore.getState().finalPage;

        const params = new URLSearchParams({
          limit: `${COUNT_USERS_ON_PAGE}`,
          skip: `${(finalPage - 1) * COUNT_USERS_ON_PAGE}`
        });

        const { data } = await api
          .get(`users?${params.toString()}`);

        set({ countUsers: get().countUsers + data.users.length });
      }

      const activePage = usePostsStore.getState().activePage;

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
    } catch (e) {
      if (e instanceof AxiosError) {
        set({ usersError: e.message });
        toast.error(e.message);
        return;
      }
      set({ error: 'Failed to get users' });
    }
  },
  getCountsUsersPosts: async (users) => {
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
  setStartUser: (userId: number) => {
    set({ startUser: userId });
  },
  setSelectedUsersIds: (ids: number[] | string) => {
    if (Array.isArray(ids)) {
      const selectedIds = getIntervalIds(ids, get().users);

      set({ selectedUsersIds: selectedIds });
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


import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import api from '../adapter';
import { COUNT_USERS_ON_PAGE } from '../../constants';

import { UserData } from './types';

type UserState = {
  isLoading: boolean,
  currentUser: number,
  users: UserData[],
  countUsers: number,
  countsUsersPosts: number[],
  usersError: string,
  countsPostsError: string,
  error: string,
  getCountUsers: () => Promise<void>,
  getSliceUsers: (activePage: number) => Promise<void>,
  getCountsUsersPosts: (users: UserData[]) => Promise<void>,
  setCurrentUser: (userId: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoading: false,
  currentUser: 0,
  users: [],
  countUsers: 0,
  countsUsersPosts: [],
  usersError: '',
  countsPostsError: '',
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
  getSliceUsers: async(activePage: number) => {
    set({ isLoading: true });

    try {
      const { data } = await api
        .get(`users?limit=10&skip=${(activePage - 1) * COUNT_USERS_ON_PAGE}`);
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
      for (const user of users) {
        const { data } = await api.get(`users/${user.id}/posts`);
        set({ countsUsersPosts: [...get().countsUsersPosts, data.posts.length] });
      }

      set({
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
  }
}));


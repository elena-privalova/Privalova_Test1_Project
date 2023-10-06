import { create } from 'zustand';
import { AxiosError } from 'axios';

import api from '../adapter';

import { UserData } from './types';

type UserState = {
  isLoading: boolean,
  currentUser: number,
  users: UserData[],
  countsUsersPosts: number[],
  usersError: string,
  countsPostsError: string,
  error: string,
  setCurrentUser: (userId: number) => void;
  getUsers: () => Promise<void>,
  getCountsUsersPosts: (users: UserData[]) => Promise<void>,
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoading: false,
  currentUser: 0,
  users: [],
  usersError: '',
  countsUsersPosts: [],
  countsPostsError: '',
  error: '',
  setCurrentUser: (userId) => {
    set({ currentUser: userId });
  },
  getUsers: async() => {
    set({ isLoading: true });

    try {
      const { data } = await api.get('users');
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
      } else if (e instanceof Error) {
        set({ error: e.message });
      }
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
      } else if (e instanceof Error) {
        set({ error: e.message });
      }
    }
  }
}));


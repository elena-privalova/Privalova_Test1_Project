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
  getCountsUsersPosts: (users: UserData[]) => void,
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
  getCountsUsersPosts: (users) => {
    try {
      users.forEach((user) => {
        api.get(`users/${user.id}/posts`)
          .then((res) => res.data)
          .then((res) => res.posts)
          .then((posts) => {
            set({ countsUsersPosts: [...get().countsUsersPosts, posts.length] });
          });
      });

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


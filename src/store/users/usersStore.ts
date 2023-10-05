import { create } from 'zustand';
import { AxiosError } from 'axios';

import api from '../adapter';

import { UserData } from './types';

type UserState = {
  isUsersLoading: boolean,
  currentUser: number,
  users: UserData[],
  countsUsersPosts: number[],
  usersError: string,
  setCurrentUser: (userId: number) => void;
  getUsers: () => Promise<UserData[]>,
  getCountsUsersPosts: (users: UserData[]) => void,
}

export const useUserStore = create<UserState>((set, get) => ({
  isUsersLoading: false,
  currentUser: 0,
  users: [],
  usersError: '',
  countsUsersPosts: [],
  setCurrentUser: (userId) => {
    set({ currentUser: userId });
  },
  getUsers: async() => {
    set({ isUsersLoading: true });
    try {
      const { data } = await api.get('users');
      set({
        isUsersLoading: false,
        users: data.users,
        usersError: ''
      });
      return data.users;
    } catch (e) {
      if (e instanceof AxiosError) {
        set({ usersError: e.message });
      }
    }
  },
  getCountsUsersPosts: (users) => {
    users.forEach((user) => {
      api.get(`users/${user.id}/posts`)
        .then((res) => res.data)
        .then((res) => res.posts)
        .then((posts) => {
          set({ countsUsersPosts: [...get().countsUsersPosts, posts.length] });
        });
    });
  }
}));


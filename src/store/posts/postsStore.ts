import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import api from '../adapter';
import { useUserStore } from '../users/usersStore';

import { PostData } from './types';

export type PostsState = {
  activePage: number,
  userPosts: PostData[],
  userPostsByCmd: number[],
  userPostsError: string,
  error: string,
  setActivePage: (numberPage: number) => void;
  getUserPosts: (ids: string[], byShift: boolean) => Promise<void>,
  setUsersPostsByCmd: (id: number) => void
}

export const usePostsStore = create<PostsState>((set, get) => ({
  activePage: 1,
  userPosts: [],
  userPostsByCmd: [],
  userPostsError: '',
  error: '',
  countsUsersPosts: [],
  setActivePage: (numberPage: number) => {
    set({ activePage: numberPage });
  },
  getUserPosts: async(ids: string[], byShift: boolean) => {
    const users = useUserStore.getState().users;

    try {
      set({ userPosts: [] });
      if (ids.length === 1) {
        const { data } = await api.get(`posts/user/${ids[0]}`);
        set({ userPosts: data.posts });
      } else if (ids.length === 2 && byShift) {
        const startIndex = users.findIndex((user) => user.id === Number(ids[0]));
        const endIndex = users.findIndex((user) => user.id === Number(ids[1]));

        const usersPosts = await Promise.all(users.slice(startIndex, endIndex + 1).map((user) => {
          return api.get(`posts/user/${user.id}`).then(res => res.data.posts);
        }));

        set({ userPosts: usersPosts.flat() });

        set({
          userPostsError: '',
          error: ''
        });
      } else if (ids.length > 2) {
        const usersPosts = await Promise.all(ids.map((id) => {
          const user = users.find((user) => user.id === Number(id));
          return api.get(`posts/user/${user!.id}`).then(res => res.data.posts);
        }));

        set({ userPosts: usersPosts.flat() });

        set({
          userPostsError: '',
          error: ''
        });
      }
    } catch(e) {
      if (e instanceof AxiosError) {
        set({ userPostsError: e.message });
        toast.error(e.message);
        return;
      }
      set({ error: 'Failed to get posts' });
    }
  },
  setUsersPostsByCmd: (id: number) => {
    if (Number(id) === -1) {
      set({ userPostsByCmd: [] });
      return;
    }
    set({ userPostsByCmd: [...get().userPostsByCmd, Number(id)] });
  }
}));


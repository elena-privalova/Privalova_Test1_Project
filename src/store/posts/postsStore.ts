import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import api from '../adapter';
import { UserData } from '../users/types';

import { PostData } from './types';

export type PostsState = {
  activePage: number,
  userPosts: PostData[],
  userPostsError: string,
  error: string,
  setActivePage: (numberPage: number) => void;
  getUserPosts: (ids: string[], users: UserData[]) => Promise<void>,
}

export const usePostsStore = create<PostsState>((set, get) => ({
  activePage: 1,
  userPosts: [],
  userPostsError: '',
  error: '',
  countsUsersPosts: [],
  setActivePage: (numberPage: number) => {
    set({ activePage: numberPage });
  },
  getUserPosts: async(ids: string[], users: UserData[]) => {
    try {
      if (ids.length === 1) {
        const { data } = await api.get(`posts/user/${ids[0]}`);
        set({ userPosts: data.posts });
      } else {
        if (get().userPosts.length > 0) set({ userPosts: [] });

        const startIndex = users.findIndex((user) => user.id === Number(ids[0]));
        const endIndex = users.findIndex((user) => user.id === Number(ids[1]));
        const sliceUsers = users;

        sliceUsers.slice(startIndex, endIndex+1).forEach((user) => {
          api.get(`posts/user/${user.id}`)
            .then(res => {
              set({ userPosts: [...get().userPosts, ...res.data.posts] });
            });
        });

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
  }
}));


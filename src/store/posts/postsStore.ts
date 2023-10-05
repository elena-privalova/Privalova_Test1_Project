import { create } from 'zustand';
import { AxiosError } from 'axios';

import api from '../adapter';
import { UserData } from '../users/types';

import { PostData } from './types';

export type PostsState = {
  userPosts: PostData[],
  postsError: string,
  getUserPosts: (startId: number, endId?: number, users?: UserData[]) => Promise<void>,
}

export const usePostsStore = create<PostsState>((set, get) => ({
  userPosts: [],
  postsError: '',
  countsUsersPosts: [],
  getUserPosts: async(startId: number, endId?: number, users?: UserData[]) => {
    try {
      if (endId == undefined) {
        const { data } = await api.get(`posts/user/${startId}`);
        set({ userPosts: data.posts });
      } else if (users != undefined) {
        if (get().userPosts.length > 0) set({ userPosts: [] });

        const startIndex = users.findIndex((user) => user.id === startId);
        const endIndex = users.findIndex((user) => user.id === endId);
        const sliceUsers = users;

        sliceUsers.slice(startIndex, endIndex+1).forEach((user) => {
          api.get(`posts/user/${user.id}`)
            .then(res => {
              set({ userPosts: [...get().userPosts, ...res.data.posts] });
            });
        });
      }
    } catch(e) {
      if (e instanceof AxiosError) {
        console.log(e.message);
      }
    }
  }
}));


import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { useUserStoreBase } from '..';
import api from '../adapter';
import createSelectors from '../selectors';

import { PostData } from './types';

export type PostsState = {
  isUsersPostsLoading: boolean,
  isReadyToAddInterval: boolean,
  isStartSelect: boolean
  userPosts: PostData[],
  userPostsError: string,
  error: string,
}

type PostsActions = {
  getUserPosts: (id?: string) => Promise<void>,
  setIsReadyToAddInterval: (isReady: boolean) => void,
  setIsStartSelect: (isSelect: boolean) => void,
};

export const usePostsStoreBase = create<PostsState & PostsActions>((set) => ({
  isUsersPostsLoading: false,
  isReadyToAddInterval: false,
  isStartSelect: false,
  userPosts: [],
  userPostsError: '',
  error: '',
  countsUsersPosts: [],
  getUserPosts: async (id?: string) => {
    const selectedUsersIds = useUserStoreBase.getState().selectedUsersIds;

    set({ isUsersPostsLoading: true });

    try {
      set({ userPosts: [] });
      if (id != undefined) {
        const { data } = await api.get(`posts/user/${id}`);
        set({ userPosts: data.posts });
        return;
      }

      const usersPosts = await Promise.all(selectedUsersIds.map((id) => {
        return api.get(`posts/user/${id}`).then(res => res.data.posts);
      }));

      set({
        isUsersPostsLoading: false,
        userPosts: usersPosts.flat(),
        userPostsError: '',
        error: ''
      });

    } catch(e) {
      if (e instanceof AxiosError) {
        set({ userPostsError: e.message });
        toast.error(e.message);
        return;
      }
      set({ error: 'Failed to get posts' });
    }
  },
  setIsReadyToAddInterval: (isReady: boolean) => {
    set({ isReadyToAddInterval: isReady });
  },
  setIsStartSelect: (isSelect: boolean) => {
    set({ isStartSelect: isSelect });
  }
}));

export const usePostsStore = createSelectors(usePostsStoreBase);

